import mongoose from 'mongoose';

const CERTIFICATE_NAMES = ['bonafide', 'character', 'transfer', 'admit_card'];

const certificateSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization',
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
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    remarks: {
        type: String,
        trim: true,
        default: ''
    },
    certificateName: {
        type: String,
        enum: CERTIFICATE_NAMES,
        required: true
    }
}, {
    timestamps: true,
    collection: 'certificate'
});

certificateSchema.index({
    organizationId: 1,
    certificateName: 1,
    classId: 1,
    sectionId: 1,
    studentId: 1,
    createdAt: -1
});

const Certificate = mongoose.model('certificate', certificateSchema, 'certificate');

export { CERTIFICATE_NAMES };
export default Certificate;
