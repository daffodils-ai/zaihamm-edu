import mongoose from 'mongoose';
import { NOTICE_TYPES } from '../constants/index.js';

const noticeBoardSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization_user',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    noticeType: {
        type: String,
        enum: Object.values(NOTICE_TYPES),
        required: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    attachments: [String],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'notice_board'
});

noticeBoardSchema.index({ organizationId: 1, createdAt: -1 });

const NoticeBoard = mongoose.model('notice_board', noticeBoardSchema, 'notice_board');

export default NoticeBoard;
