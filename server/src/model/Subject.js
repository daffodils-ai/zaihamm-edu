import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    nameNormalized: {
        type: String,
        required: true,
        trim: true
    },
    classIds: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'class'
        }],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'subject'
});

subjectSchema.index({ organizationId: 1, nameNormalized: 1 }, { unique: true });
subjectSchema.index({ organizationId: 1, classIds: 1 });

const Subject = mongoose.model('subject', subjectSchema, 'subject');

export default Subject;
