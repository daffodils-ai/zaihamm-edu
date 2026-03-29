import mongoose from 'mongoose';
import { STUDENT_STATUS } from '../constants/index.js';

const studentSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization',
        required: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    bloodGroup: {
        type: String,
        trim: true
    },
    mobile: {
        type: String,
        trim: true
    },
    parentMobile: {
        type: String,
        required: true
    },
    studentEmail: {
        type: String,
        lowercase: true,
        trim: true
    },
    parentEmail: {
        type: String,
        lowercase: true,
        trim: true
    },
    fatherName: {
        type: String,
        required: true,
        trim: true
    },
    motherName: {
        type: String,
        required: true,
        trim: true
    },
    guardianName: {
        type: String,
        trim: true
    },
    aadharNo: {
        type: String,
        required: true,
        unique: true
    },
    parentAadharNumber: {
        type: String,
        required: true
    },
    parentAadharRelation: {
        type: String,
        enum: ['father', 'mother', 'brother', 'sister', 'other'],
        required: true
    },
    fullAddress: {
        type: String,
        required: true
    },
    parentPic: {
        type: String
    },
    studentPic: {
        type: String
    },
    registrationNumber: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(STUDENT_STATUS),
        default: STUDENT_STATUS.ACTIVE
    },
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
    collection: 'student'
});

studentSchema.index({ organizationId: 1, aadharNo: 1 });
studentSchema.index({ organizationId: 1, registrationNumber: 1 });
studentSchema.index({ aadharNo: 1 });

const Student = mongoose.model('student', studentSchema, 'student');

export default Student;
