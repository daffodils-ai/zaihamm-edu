import Class from '../model/Class.js';
import Section from '../model/Section.js';
import Student from '../model/Student.js';
import Subject from '../model/Subject.js';
import ExamResultRepository from '../repository/ExamResultRepository.js';
import ExamResultPdfService from './ExamResultPdfService.js';
import { ApiError } from '../utils/error.js';
import { HTTP_CODES } from '../constants/index.js';
import { Logger } from '../logger/logger.js';

const normalizeText = (value) => value.trim().toLowerCase();
const buildSectionKey = (sectionId) => sectionId || 'no-section';
const resolveId = (value) => value?._id?.toString?.() || value?.toString?.() || '';

const roundTwo = (value) => Math.round(value * 100) / 100;

const computeOverallGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
};

class ExamResultService {
    validateSubjects(subjects = []) {
        if (!Array.isArray(subjects) || subjects.length === 0) {
            throw new ApiError(HTTP_CODES.BAD_REQUEST, 'At least one subject result is required');
        }

        const seen = new Set();
        return subjects.map((subject) => {
            const subjectId = resolveId(subject.subjectId).trim();
            const subjectName = `${subject.subject || ''}`.trim();
            const grade = `${subject.grade || ''}`.trim();
            const internalMarks = Number(subject.internalMarks);
            const externalMarks = Number(subject.externalMarks);
            const obtainedMarks = internalMarks + externalMarks;
            const passMarks = Number(subject.passMarks);
            const totalMarks = Number(subject.totalMarks);

            if (
                !subjectId
                || !subjectName
                || !grade
                || Number.isNaN(internalMarks)
                || Number.isNaN(externalMarks)
                || Number.isNaN(passMarks)
                || Number.isNaN(totalMarks)
            ) {
                throw new ApiError(
                    HTTP_CODES.BAD_REQUEST,
                    'Each subject must include subjectId, subject, internal marks, external marks, pass marks, total marks and grade'
                );
            }

            if (internalMarks < 0 || externalMarks < 0 || passMarks < 0 || totalMarks <= 0) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Marks must be valid positive numbers');
            }

            if (obtainedMarks > totalMarks || passMarks > totalMarks) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Obtained marks and pass marks cannot exceed total marks');
            }

            const normalized = normalizeText(subjectId);
            if (seen.has(normalized)) {
                throw new ApiError(HTTP_CODES.CONFLICT, `Duplicate subject "${subjectName}" is not allowed in the same exam result`);
            }
            seen.add(normalized);

            return {
                subjectId,
                subject: subjectName,
                internalMarks,
                externalMarks,
                obtainedMarks,
                passMarks,
                totalMarks,
                grade
            };
        });
    }

    buildComputedFields(subjects) {
        const totalObtainedMarks = subjects.reduce((sum, item) => sum + item.obtainedMarks, 0);
        const totalPassMarks = subjects.reduce((sum, item) => sum + item.passMarks, 0);
        const totalMarks = subjects.reduce((sum, item) => sum + item.totalMarks, 0);
        const resultStatus = subjects.every((item) => item.obtainedMarks >= item.passMarks) ? 'pass' : 'fail';
        const percentage = totalMarks > 0 ? roundTwo((totalObtainedMarks / totalMarks) * 100) : 0;
        const overallGrade = computeOverallGrade(percentage);

        return {
            totalObtainedMarks,
            totalPassMarks,
            totalMarks,
            percentage,
            overallGrade,
            resultStatus
        };
    }

    async validateSubjectMappings(organizationId, classId, subjects = []) {
        const subjectIds = [...new Set(subjects.map((item) => item.subjectId))];
        const availableSubjects = await Subject.find({
            _id: { $in: subjectIds },
            organizationId,
            isActive: true
        }).select('_id name classIds organizationId');

        if (availableSubjects.length !== subjectIds.length) {
            throw new ApiError(HTTP_CODES.BAD_REQUEST, 'One or more selected subjects are invalid');
        }

        const subjectMap = new Map(availableSubjects.map((item) => [item._id.toString(), item]));

        return subjects.map((item) => {
            const subject = subjectMap.get(item.subjectId);
            if (!subject) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Selected subject is invalid');
            }

            const allowedForClass = !subject.classIds?.length
                || subject.classIds.some((id) => id.toString() === classId);
            if (!allowedForClass) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, `Subject "${subject.name}" is not available for the selected class`);
            }

            return {
                ...item,
                subjectId: subject._id.toString(),
                subject: subject.name
            };
        });
    }

    async validateRelations({ studentId, classId, sectionId }) {
        const [student, classData, section] = await Promise.all([
            Student.findById(studentId),
            Class.findById(classId),
            sectionId ? Section.findById(sectionId) : Promise.resolve(null)
        ]);

        if (!student) {
            throw new ApiError(HTTP_CODES.NOT_FOUND, 'Student not found');
        }

        if (!classData) {
            throw new ApiError(HTTP_CODES.NOT_FOUND, 'Class not found');
        }

        if (sectionId) {
            if (!section) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'Section not found');
            }

            if (section.classId.toString() !== classId) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Selected section does not belong to the selected class');
            }
        }
    }

    async ensureUniqueExam(identity) {
        const duplicate = await ExamResultRepository.findDuplicateExam(identity);
        if (duplicate) {
            throw new ApiError(HTTP_CODES.CONFLICT, 'Exam result already exists for this student, class, section, year and exam name');
        }
    }

    async create(data) {
        try {
            const validatedSubjects = this.validateSubjects(data.subjects);
            await this.validateRelations(data);
            const subjects = await this.validateSubjectMappings(data.organizationId, data.classId, validatedSubjects);

            const examName = `${data.examName || ''}`.trim();
            if (!examName || !data.examDate || !data.year) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, 'studentId, classId, year, examName, examDate and subjects are required');
            }

            const identity = {
                organizationId: data.organizationId,
                studentId: data.studentId,
                classId: data.classId,
                sectionKey: buildSectionKey(data.sectionId),
                year: Number(data.year),
                examNameNormalized: normalizeText(examName)
            };

            await this.ensureUniqueExam(identity);

            const result = await ExamResultRepository.create({
                ...data,
                year: Number(data.year),
                examName,
                examNameNormalized: identity.examNameNormalized,
                sectionId: data.sectionId || null,
                sectionKey: identity.sectionKey,
                examDate: new Date(data.examDate),
                subjects,
                ...this.buildComputedFields(subjects)
            });

            Logger.log(`Exam result created: ${result._id}`, Logger.Level.INFO);
            return await ExamResultRepository.findById(result._id);
        } catch (error) {
            Logger.log(`Error creating exam result: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getById(id) {
        const result = await ExamResultRepository.findById(id);
        if (!result) {
            throw new ApiError(HTTP_CODES.NOT_FOUND, 'Exam result not found');
        }
        return result;
    }

    async getAll(organizationId, filters = {}, page = 1, limit = 10) {
        try {
            return await ExamResultRepository.findAll(organizationId, filters, page, limit);
        } catch (error) {
            Logger.log(`Error fetching exam results: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const existing = await this.getById(id);
            if (existing.isFinalized) {
                throw new ApiError(HTTP_CODES.CONFLICT, 'Finalized result cannot be updated');
            }

            const merged = {
                organizationId: existing.organizationId.toString(),
                studentId: data.studentId || existing.studentId?._id?.toString() || existing.studentId.toString(),
                classId: data.classId || existing.classId?._id?.toString() || existing.classId.toString(),
                sectionId: Object.prototype.hasOwnProperty.call(data, 'sectionId')
                    ? (data.sectionId || null)
                    : (existing.sectionId?._id?.toString() || existing.sectionId?.toString() || null),
                year: data.year || existing.year,
                examName: data.examName || existing.examName,
                examDate: data.examDate || existing.examDate,
                subjects: data.subjects || existing.subjects
            };

            const validatedSubjects = this.validateSubjects(merged.subjects);
            await this.validateRelations(merged);
            const subjects = await this.validateSubjectMappings(merged.organizationId, merged.classId, validatedSubjects);

            const examNameNormalized = normalizeText(merged.examName);
            await this.ensureUniqueExam({
                organizationId: merged.organizationId,
                studentId: merged.studentId,
                classId: merged.classId,
                sectionKey: buildSectionKey(merged.sectionId),
                year: Number(merged.year),
                examNameNormalized,
                excludeId: id
            });

            const updated = await ExamResultRepository.update(id, {
                studentId: merged.studentId,
                classId: merged.classId,
                sectionId: merged.sectionId,
                sectionKey: buildSectionKey(merged.sectionId),
                year: Number(merged.year),
                examName: merged.examName.trim(),
                examNameNormalized,
                examDate: new Date(merged.examDate),
                subjects,
                ...this.buildComputedFields(subjects),
                updatedAt: new Date()
            });

            Logger.log(`Exam result updated: ${id}`, Logger.Level.INFO);
            return updated;
        } catch (error) {
            Logger.log(`Error updating exam result: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async delete(id) {
        try {
            const existing = await this.getById(id);
            if (existing.isFinalized) {
                throw new ApiError(HTTP_CODES.CONFLICT, 'Finalized result cannot be deleted');
            }

            await ExamResultRepository.delete(id);
            Logger.log(`Exam result deleted: ${id}`, Logger.Level.INFO);
        } catch (error) {
            Logger.log(`Error deleting exam result: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async finalize(id) {
        try {
            const existing = await this.getById(id);
            if (existing.isFinalized) {
                throw new ApiError(HTTP_CODES.CONFLICT, 'Result is already finalized');
            }

            return await ExamResultRepository.update(id, {
                isFinalized: true,
                finalizedAt: new Date(),
                updatedAt: new Date()
            });
        } catch (error) {
            Logger.log(`Error finalizing exam result: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async generatePdf(id) {
        const result = await this.getById(id);
        return ExamResultPdfService.generate(result);
    }
}

export default new ExamResultService();
