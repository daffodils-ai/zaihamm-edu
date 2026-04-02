import SubjectRepository from '../repository/SubjectRepository.js';
import ExamResultRepository from '../repository/ExamResultRepository.js';
import Class from '../model/Class.js';
import ExamResult from '../model/ExamResult.js';
import { ApiError } from '../utils/error.js';
import { HTTP_CODES } from '../constants/index.js';

const normalizeName = (value) => `${value || ''}`.trim().toLowerCase();

class SubjectService {
    async attachLinkedState(subjects = []) {
        if (!subjects.length) {
            return [];
        }

        const subjectIds = subjects.map((subject) => subject._id);
        const linkedIds = await ExamResult.distinct('subjects.subjectId', {
            'subjects.subjectId': { $in: subjectIds }
        });
        const linkedSet = new Set(linkedIds.map((item) => item.toString()));

        return subjects.map((subject) => {
            const normalized = typeof subject.toObject === 'function' ? subject.toObject() : { ...subject };
            return {
                ...normalized,
                isLinked: linkedSet.has(subject._id.toString())
            };
        });
    }

    async validateClassIds(organizationId, classIds = []) {
        if (!Array.isArray(classIds)) {
            throw new ApiError(HTTP_CODES.BAD_REQUEST, 'classIds must be an array');
        }

        const normalized = [...new Set(classIds.filter(Boolean))];
        if (!normalized.length) {
            return [];
        }

        const classes = await Class.find({
            _id: { $in: normalized },
            organizationId
        }).select('_id');

        if (classes.length !== normalized.length) {
            throw new ApiError(HTTP_CODES.BAD_REQUEST, 'One or more selected classes are invalid');
        }

        return normalized;
    }

    async ensureUnique(organizationId, name, excludeId = null) {
        const existing = await SubjectRepository.findByName(organizationId, normalizeName(name), excludeId);
        if (existing) {
            throw new ApiError(HTTP_CODES.CONFLICT, 'Subject with this name already exists');
        }
    }

    async create(organizationId, data) {
        const name = `${data.name || ''}`.trim();
        if (!name) {
            throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Subject name is required');
        }

        const classIds = await this.validateClassIds(organizationId, data.classIds || []);
        await this.ensureUnique(organizationId, name);

        return SubjectRepository.create({
            organizationId,
            name,
            nameNormalized: normalizeName(name),
            classIds
        });
    }

    async getAll(organizationId, filters = {}, page = 1, limit = 10) {
        const result = await SubjectRepository.findAll(organizationId, filters, page, limit);
        return {
            ...result,
            data: await this.attachLinkedState(result.data)
        };
    }

    async getAvailable(organizationId, classId = null) {
        return SubjectRepository.findAvailableByClass(organizationId, classId);
    }

    async getById(id) {
        const subject = await SubjectRepository.findById(id);
        if (!subject) {
            throw new ApiError(HTTP_CODES.NOT_FOUND, 'Subject not found');
        }
        const [enriched] = await this.attachLinkedState([subject]);
        return enriched;
    }

    async ensureNotLinked(id) {
        const linked = await ExamResultRepository.isSubjectLinked(id);
        if (linked) {
            throw new ApiError(HTTP_CODES.CONFLICT, 'Subject is linked with exam results and cannot be edited or deleted');
        }
    }

    async update(id, organizationId, data) {
        const existing = await this.getById(id);
        if (existing.organizationId.toString() !== organizationId) {
            throw new ApiError(HTTP_CODES.FORBIDDEN, 'Forbidden');
        }

        await this.ensureNotLinked(id);

        const name = `${data.name || existing.name || ''}`.trim();
        if (!name) {
            throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Subject name is required');
        }

        const classIds = await this.validateClassIds(
            organizationId,
            Object.prototype.hasOwnProperty.call(data, 'classIds') ? data.classIds : existing.classIds
        );

        await this.ensureUnique(organizationId, name, id);

        return SubjectRepository.update(id, {
            name,
            nameNormalized: normalizeName(name),
            classIds,
            isActive: Object.prototype.hasOwnProperty.call(data, 'isActive') ? !!data.isActive : existing.isActive
        });
    }

    async delete(id, organizationId) {
        const existing = await this.getById(id);
        if (existing.organizationId.toString() !== organizationId) {
            throw new ApiError(HTTP_CODES.FORBIDDEN, 'Forbidden');
        }

        await this.ensureNotLinked(id);
        await SubjectRepository.delete(id);
    }
}

export default new SubjectService();
