import AdmissionTrackerRepository from '../repository/AdmissionTrackerRepository.js';
import StudentRepository from '../repository/StudentRepository.js';
import StudentService from './StudentService.js';
import FeeService from './FeeService.js';
import Class from '../model/Class.js';
import Section from '../model/Section.js';
import XLSX from 'xlsx';
import mongoose from 'mongoose';
import { ApiError } from '../utils/error.js';
import { HTTP_CODES, FEE_STATUS, FEE_TYPES } from '../constants/index.js';
import { Logger } from '../logger/logger.js';

const TEMPLATE_HEADERS = [
    'fullName',
    'dateOfBirth',
    'gender',
    'bloodGroup',
    'mobile',
    'parentMobile',
    'studentEmail',
    'parentEmail',
    'fatherName',
    'motherName',
    'motherAadharNo',
    'guardianName',
    'aadharNo',
    'parentAadharNumber',
    'parentAadharRelation',
    'fullAddress',
    'previousSchool',
    'previousClass',
    'className',
    'sectionName',
    'year',
    'admissionFeeAmount',
    'admissionFeeDueDate',
    'feeRemarks'
];

const csvEscape = (value) => {
    const normalized = value === null || value === undefined ? '' : String(value);
    if (/[",\n]/.test(normalized)) {
        return `"${normalized.replace(/"/g, '""')}"`;
    }
    return normalized;
};

/**
 * Service for AdmissionTracker operations
 */
class AdmissionTrackerService {
    async create(data, options = {}) {
        try {
            const admission = await AdmissionTrackerRepository.create(data, options);
            Logger.log(`Admission entry created for: ${data.fullName}`, Logger.Level.INFO);
            return admission;
        } catch (error) {
            Logger.log(`Error creating admission entry: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getById(id) {
        try {
            const admission = await AdmissionTrackerRepository.findById(id);
            if (!admission) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'Admission entry not found');
            }
            return admission;
        } catch (error) {
            Logger.log(`Error fetching admission entry: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getAll(filters = {}, page = 1, limit = 10) {
        try {
            return await AdmissionTrackerRepository.findAll(filters, page, limit);
        } catch (error) {
            Logger.log(`Error fetching admission entries: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const admission = await AdmissionTrackerRepository.update(id, data);
            if (!admission) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'Admission entry not found');
            }
            Logger.log(`Admission entry updated: ${id}`, Logger.Level.INFO);
            return admission;
        } catch (error) {
            Logger.log(`Error updating admission entry: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async delete(id, options = {}) {
        try {
            const admission = await AdmissionTrackerRepository.delete(id, options);
            if (!admission) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'Admission entry not found');
            }
            Logger.log(`Admission entry deleted: ${id}`, Logger.Level.INFO);
            return admission;
        } catch (error) {
            Logger.log(`Error deleting admission entry: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    getTemplateHeaders() {
        return TEMPLATE_HEADERS;
    }

    generateTemplateCsv() {
        return `${TEMPLATE_HEADERS.join(',')}\n`;
    }

    generateTemplateWorkbook() {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet([TEMPLATE_HEADERS]);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'AdmissionsTemplate');
        return XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    }

    async exportCsv(filters = {}) {
        const records = await AdmissionTrackerRepository.findAllForExport(filters);
        const rows = records.map((record) => [
            record.fullName,
            record.dateOfBirth ? new Date(record.dateOfBirth).toISOString().slice(0, 10) : '',
            record.gender || '',
            record.bloodGroup || '',
            record.mobile || '',
            record.parentMobile || '',
            record.studentEmail || '',
            record.parentEmail || '',
            record.fatherName || '',
            record.motherName || '',
            record.motherAadharNo || '',
            record.guardianName || '',
            record.aadharNo || '',
            record.parentAadharNumber || '',
            record.parentAadharRelation || '',
            record.fullAddress || '',
            record.previousSchool || '',
            record.previousClass || '',
            record.classId?.name || record.class || '',
            record.sectionId?.name || '',
            '',
            '',
            '',
            ''
        ]);

        return [
            TEMPLATE_HEADERS.join(','),
            ...rows.map((row) => row.map(csvEscape).join(','))
        ].join('\n');
    }

    async exportWorkbook(filters = {}) {
        const records = await AdmissionTrackerRepository.findAllForExport(filters);
        const rows = records.map((record) => ({
            fullName: record.fullName,
            dateOfBirth: record.dateOfBirth ? new Date(record.dateOfBirth).toISOString().slice(0, 10) : '',
            gender: record.gender || '',
            bloodGroup: record.bloodGroup || '',
            mobile: record.mobile || '',
            parentMobile: record.parentMobile || '',
            studentEmail: record.studentEmail || '',
            parentEmail: record.parentEmail || '',
            fatherName: record.fatherName || '',
            motherName: record.motherName || '',
            motherAadharNo: record.motherAadharNo || '',
            guardianName: record.guardianName || '',
            aadharNo: record.aadharNo || '',
            parentAadharNumber: record.parentAadharNumber || '',
            parentAadharRelation: record.parentAadharRelation || '',
            fullAddress: record.fullAddress || '',
            previousSchool: record.previousSchool || '',
            previousClass: record.previousClass || '',
            className: record.classId?.name || record.class || '',
            sectionName: record.sectionId?.name || '',
            year: '',
            admissionFeeAmount: '',
            admissionFeeDueDate: '',
            feeRemarks: ''
        }));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(rows, { header: TEMPLATE_HEADERS });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Admissions');
        return XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    }

    parseWorkbook(buffer) {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        if (!firstSheet) {
            return [];
        }

        return XLSX.utils.sheet_to_json(firstSheet, {
            defval: '',
            raw: false
        });
    }

    calculateAgeFromDob(dateOfBirth) {
        const parsedDate = new Date(dateOfBirth);
        if (Number.isNaN(parsedDate.getTime())) {
            return null;
        }

        const today = new Date();
        const diffMs = today.getTime() - parsedDate.getTime();
        const yearMs = 365.2425 * 24 * 60 * 60 * 1000;

        return Math.max(Math.floor(diffMs / yearMs), 0);
    }

    normalizeRow(row = {}) {
        const normalized = {};
        for (const [key, value] of Object.entries(row)) {
            normalized[key] = typeof value === 'string' ? value.trim() : value;
        }
        return normalized;
    }

    async findClassByName(organizationId, className) {
        const normalized = `${className || ''}`.trim();
        if (!normalized) {
            return null;
        }

        return Class.findOne({
            organizationId,
            name: { $regex: `^${normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' }
        });
    }

    async findSectionByName(organizationId, classId, sectionName) {
        const normalized = `${sectionName || ''}`.trim();
        if (!normalized) {
            return null;
        }

        return Section.findOne({
            organizationId,
            classId,
            name: { $regex: `^${normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' }
        });
    }

    async bulkAdmitStudents(organizationId, rows = []) {
        const summary = {
            totalRows: rows.length,
            created: 0,
            skipped: 0,
            failed: 0,
            details: []
        };
        const seenAadhar = new Set();

        for (let index = 0; index < rows.length; index += 1) {
            const rowNumber = index + 2;
            const row = this.normalizeRow(rows[index]);

            try {
                if (!row.fullName || !row.dateOfBirth || !row.parentMobile || !row.fatherName || !row.motherName || !row.aadharNo || !row.parentAadharNumber || !row.parentAadharRelation || !row.fullAddress || !row.className || !row.year) {
                    summary.failed += 1;
                    summary.details.push({ row: rowNumber, status: 'failed', message: 'Missing required fields' });
                    continue;
                }

                const normalizedAadhar = row.aadharNo;
                if (seenAadhar.has(normalizedAadhar)) {
                    summary.skipped += 1;
                    summary.details.push({ row: rowNumber, status: 'skipped', message: 'Duplicate aadhar in uploaded file' });
                    continue;
                }
                seenAadhar.add(normalizedAadhar);

                const session = await mongoose.startSession();
                try {
                    await session.withTransaction(async () => {
                        const [existingStudent, existingAdmission, classData] = await Promise.all([
                            StudentRepository.findByAadhar(normalizedAadhar, organizationId, { session }),
                            AdmissionTrackerRepository.findByAadhar(normalizedAadhar, { session }),
                            this.findClassByName(organizationId, row.className)
                        ]);

                        if (existingStudent || existingAdmission) {
                            summary.skipped += 1;
                            summary.details.push({ row: rowNumber, status: 'skipped', message: 'Duplicate admission/student record found for aadhar' });
                            return;
                        }

                        if (!classData) {
                            summary.failed += 1;
                            summary.details.push({ row: rowNumber, status: 'failed', message: `Class "${row.className}" not found` });
                            return;
                        }

                        const sectionData = row.sectionName
                            ? await this.findSectionByName(organizationId, classData._id, row.sectionName)
                            : null;

                        if (row.sectionName && !sectionData) {
                            summary.failed += 1;
                            summary.details.push({ row: rowNumber, status: 'failed', message: `Section "${row.sectionName}" not found for class "${row.className}"` });
                            return;
                        }

                        const age = this.calculateAgeFromDob(row.dateOfBirth);
                        if (age === null) {
                            summary.failed += 1;
                            summary.details.push({ row: rowNumber, status: 'failed', message: 'Invalid dateOfBirth' });
                            return;
                        }

                        const student = await StudentService.admitStudent({
                            organizationId,
                            fullName: row.fullName,
                            age,
                            dateOfBirth: row.dateOfBirth,
                            gender: row.gender || '',
                            bloodGroup: row.bloodGroup || '',
                            mobile: row.mobile || '',
                            parentMobile: row.parentMobile,
                            studentEmail: row.studentEmail || '',
                            parentEmail: row.parentEmail || '',
                            fatherName: row.fatherName,
                            motherName: row.motherName,
                            motherAadharNo: row.motherAadharNo || '',
                            guardianName: row.guardianName || '',
                            aadharNo: row.aadharNo,
                            parentAadharNumber: row.parentAadharNumber,
                            parentAadharRelation: row.parentAadharRelation,
                            fullAddress: row.fullAddress,
                            previousSchool: row.previousSchool || '',
                            previousClass: row.previousClass || ''
                        }, { session });

                        const sessionResult = await StudentService.createStudentSession({
                            organizationId,
                            studentId: student._id,
                            classId: classData._id,
                            sectionId: sectionData?._id || null,
                            year: Number(row.year),
                            registrationNumber: student.registrationNumber
                        }, { session });

                        await FeeService.create({
                            organizationId,
                            studentId: student._id,
                            studentSessionId: sessionResult.session._id,
                            classId: classData._id,
                            sectionId: sectionData?._id || null,
                            type: FEE_TYPES.ADMISSION,
                            amount: Number(row.admissionFeeAmount || 0),
                            dueDate: row.admissionFeeDueDate || new Date().toISOString().slice(0, 10),
                            status: FEE_STATUS.PENDING,
                            remarks: row.feeRemarks || 'Bulk admission fee'
                        }, { session });

                        summary.created += 1;
                        summary.details.push({
                            row: rowNumber,
                            status: 'created',
                            message: `Student admitted successfully (${student.registrationNumber})`
                        });
                    });
                } finally {
                    await session.endSession();
                }
            } catch (error) {
                summary.failed += 1;
                summary.details.push({
                    row: rowNumber,
                    status: 'failed',
                    message: error.message || 'Unexpected error'
                });
            }
        }

        return summary;
    }
}

export default new AdmissionTrackerService();
