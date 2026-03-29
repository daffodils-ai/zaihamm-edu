import NoticeBoard from '../model/NoticeBoard.js';
import { buildFilterQuery, buildPaginationOptions } from '../utils/index.js';

/**
 * Repository for NoticeBoard operations
 */
class NoticeBoardRepository {
    async create(data) {
        return new NoticeBoard(data).save();
    }

    async findById(id) {
        return NoticeBoard.findById(id).populate('createdBy', 'firstName lastName email');
    }

    async findAll(organizationId, filters = {}, page = 1, limit = 10) {
        const allowedFields = ['title', 'description'];
        const query = { organizationId };
        Object.assign(query, buildFilterQuery(filters, allowedFields));

        const pagination = buildPaginationOptions(page, limit);
        const [data, total] = await Promise.all([
            NoticeBoard.find(query)
                .populate('createdBy', 'firstName lastName email')
                .skip(pagination.skip)
                .limit(pagination.limit)
                .sort({ createdAt: -1 }),
            NoticeBoard.countDocuments(query)
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async update(id, data) {
        return NoticeBoard.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).populate('createdBy', 'firstName lastName email');
    }

    async delete(id) {
        return NoticeBoard.findByIdAndDelete(id);
    }

    async findRecentNotices(organizationId, limit = 5) {
        return NoticeBoard.find({ organizationId })
            .populate('createdBy', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .limit(limit);
    }
}

export default new NoticeBoardRepository();
