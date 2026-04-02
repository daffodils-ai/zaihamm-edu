import { mkdtemp, rm, writeFile, readFile } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import CertificateRepository from '../repository/CertificateRepository.js';
import StudentSessionRepository from '../repository/StudentSessionRepository.js';
import StudentRepository from '../repository/StudentRepository.js';
import CertificatePdfService from './CertificatePdfService.js';
import Class from '../model/Class.js';
import Section from '../model/Section.js';
import { CERTIFICATE_NAMES } from '../model/Certificate.js';
import { ApiError } from '../utils/error.js';
import { HTTP_CODES } from '../constants/index.js';

const execFileAsync = promisify(execFile);

const sanitizeFileName = (value) => `${value || 'certificate'}`
    .replace(/[^a-z0-9-_ ]/gi, '')
    .replace(/\s+/g, '_');

class CertificateService {
    async validateFilters(organizationId, { classId, sectionId, studentIds = [], certificateNames = [] }) {
        if (!classId) {
            throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Class is required');
        }

        const classData = await Class.findOne({ _id: classId, organizationId });
        if (!classData) {
            throw new ApiError(HTTP_CODES.NOT_FOUND, 'Class not found');
        }

        let section = null;
        if (sectionId) {
            section = await Section.findOne({ _id: sectionId, organizationId, classId });
            if (!section) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'Section not found for selected class');
            }
        }

        const invalidCertificate = certificateNames.find((item) => !CERTIFICATE_NAMES.includes(item));
        if (invalidCertificate) {
            throw new ApiError(HTTP_CODES.BAD_REQUEST, `Invalid certificate type: ${invalidCertificate}`);
        }

        if (!certificateNames.length) {
            throw new ApiError(HTTP_CODES.BAD_REQUEST, 'At least one certificate type must be selected');
        }

        if (!Array.isArray(studentIds)) {
            throw new ApiError(HTTP_CODES.BAD_REQUEST, 'studentIds must be an array');
        }

        return { classData, section };
    }

    resolveClassId(session) {
        return session?.classId?._id?.toString?.() || session?.classId?.toString?.() || null;
    }

    resolveSectionId(session) {
        return session?.sectionId?._id?.toString?.() || session?.sectionId?.toString?.() || null;
    }

    async resolveStudents(organizationId, { classId, sectionId = null, studentIds = [] }) {
        if (studentIds.length) {
            const students = await Promise.all(
                studentIds.map(async (studentId) => ({
                    student: await StudentRepository.findById(studentId),
                    latestSession: await StudentSessionRepository.findLatestByStudent(studentId)
                }))
            );

            const filtered = students.filter(({ student, latestSession }) => (
                student
                && student.organizationId.toString() === organizationId
                && latestSession
                && this.resolveClassId(latestSession) === classId
                && (!sectionId || this.resolveSectionId(latestSession) === sectionId)
            ));

            if (!filtered.length) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, 'No matching students found for the selected filters');
            }

            return filtered;
        }

        const sessions = await StudentSessionRepository.findByClassAndSection(classId, sectionId, organizationId);
        if (!sessions.length) {
            throw new ApiError(HTTP_CODES.BAD_REQUEST, 'No students found for the selected class/section');
        }

        return sessions
            .map((session) => ({
                student: session.studentId?._id ? session.studentId : null,
                latestSession: session
            }))
            .filter(({ student }) => student && student.organizationId.toString() === organizationId);
    }

    async generateRecords(organizationId, payload) {
        await this.validateFilters(organizationId, payload);

        const rows = await this.resolveStudents(organizationId, payload);
        const records = [];

        rows.forEach(({ student, latestSession }) => {
            payload.certificateNames.forEach((certificateName) => {
                const resolvedSectionId = this.resolveSectionId(latestSession) || payload.sectionId || null;

                records.push({
                    organizationId,
                    classId: this.resolveClassId(latestSession) || payload.classId,
                    sectionId: resolvedSectionId,
                    studentId: student._id,
                    remarks: `${payload.remarks || ''}`.trim(),
                    certificateName
                });
            });
        });

        if (!records.length) {
            throw new ApiError(HTTP_CODES.BAD_REQUEST, 'No certificate records could be created');
        }

        return CertificateRepository.createMany(records);
    }

    async getAll(organizationId, filters = {}, page = 1, limit = 10) {
        return CertificateRepository.findAll(organizationId, filters, page, limit);
    }

    getCertificateNames() {
        return CERTIFICATE_NAMES;
    }

    async downloadZip(organizationId, ids = []) {
        if (!Array.isArray(ids) || !ids.length) {
            throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Please select at least one certificate record');
        }

        const records = await CertificateRepository.findByIds(organizationId, ids);
        if (!records.length) {
            throw new ApiError(HTTP_CODES.NOT_FOUND, 'No certificate records found');
        }

        const tempDir = await mkdtemp(path.join(tmpdir(), 'edu-certificates-'));
        const zipPath = path.join(tempDir, 'certificates.zip');

        try {
            const pdfNames = await Promise.all(records.map(async (record) => {
                const pdf = await CertificatePdfService.generate(record);
                const parts = [
                    sanitizeFileName(record.studentId?.fullName),
                    sanitizeFileName(record.classId?.name)
                ];
                if (record.sectionId?.name) {
                    parts.push(sanitizeFileName(record.sectionId.name));
                }
                const fileName = `${parts.join('_')}.pdf`;
                await writeFile(path.join(tempDir, fileName), pdf);
                return fileName;
            }));

            await execFileAsync('zip', ['-j', zipPath, ...pdfNames], { cwd: tempDir });
            return readFile(zipPath);
        } catch (error) {
            throw new ApiError(HTTP_CODES.INTERNAL_ERROR, error.message || 'Failed to generate zip file');
        } finally {
            await rm(tempDir, { recursive: true, force: true });
        }
    }
}

export default new CertificateService();
