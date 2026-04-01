
import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    class: {
        type: String,
        required: true,
        trim: true
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'class',
        default: null
    },
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'section',
        default: null
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
    previousSchool: {
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
    collection: 'admission_tracker'
});

studentSchema.index({ organizationId: 1, aadharNo: 1 });
studentSchema.index({ organizationId: 1, registrationNumber: 1 });
studentSchema.index({ aadharNo: 1 });

const AdmissionTracker = mongoose.model('admission_tracker', studentSchema, 'admission_tracker');

export default AdmissionTracker;
