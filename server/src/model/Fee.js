import mongoose from 'mongoose';
import { FEE_TYPES, FEE_STATUS } from '../constants/index.js';

const feeSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    studentSessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student_session',
        required: true
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'class',
        required: true
    },
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'section',
        default: null
    },
    type: {
        type: String,
        enum: Object.values(FEE_TYPES),
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    paidDate: {
        type: Date
    },
    status: {
        type: String,
        enum: Object.values(FEE_STATUS),
        default: FEE_STATUS.PENDING
    },
    remarks: {
        type: String,
        trim: true
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
    collection: 'fee'
});

feeSchema.index({ organizationId: 1, studentId: 1 });
feeSchema.index({ organizationId: 1, status: 1 });
feeSchema.index({ dueDate: 1, status: 1 });

const Fee = mongoose.model('fee', feeSchema, 'fee');

export default Fee;
