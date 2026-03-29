import mongoose from 'mongoose';

const studentSessionSchema = new mongoose.Schema({
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
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'class',
        required: true
    },
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'section',
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true
    },
    defaultPassword: {
        type: String,
        required: true
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
    collection: 'student_session'
});

studentSessionSchema.index({ organizationId: 1, studentId: 1 });
studentSessionSchema.index({ organizationId: 1, year: 1 });
studentSessionSchema.index({ studentId: 1, year: 1 });

const StudentSession = mongoose.model('student_session', studentSessionSchema, 'student_session');

export default StudentSession;
