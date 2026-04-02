import mongoose from 'mongoose';

const examSubjectSchema = new mongoose.Schema({
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    internalMarks: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    externalMarks: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    obtainedMarks: {
        type: Number,
        required: true,
        min: 0
    },
    passMarks: {
        type: Number,
        required: true,
        min: 0
    },
    totalMarks: {
        type: Number,
        required: true,
        min: 0
    },
    grade: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: true });

const examResultSchema = new mongoose.Schema({
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
        default: null
    },
    sectionKey: {
        type: String,
        required: true,
        default: 'no-section'
    },
    year: {
        type: Number,
        required: true,
        min: 2000
    },
    examName: {
        type: String,
        required: true,
        trim: true
    },
    examNameNormalized: {
        type: String,
        required: true,
        trim: true
    },
    examDate: {
        type: Date,
        required: true
    },
    subjects: {
        type: [examSubjectSchema],
        validate: {
            validator(subjects) {
                return Array.isArray(subjects) && subjects.length > 0;
            },
            message: 'At least one subject is required'
        }
    },
    totalObtainedMarks: {
        type: Number,
        default: 0
    },
    totalPassMarks: {
        type: Number,
        default: 0
    },
    totalMarks: {
        type: Number,
        default: 0
    },
    percentage: {
        type: Number,
        default: 0
    },
    overallGrade: {
        type: String,
        trim: true
    },
    resultStatus: {
        type: String,
        enum: ['pass', 'fail'],
        default: 'pass'
    },
    isFinalized: {
        type: Boolean,
        default: false
    },
    finalizedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    collection: 'exam_result'
});

examResultSchema.index({
    organizationId: 1,
    studentId: 1,
    classId: 1,
    sectionKey: 1,
    year: 1,
    examNameNormalized: 1
}, { unique: true });

examResultSchema.index({ organizationId: 1, examDate: -1 });
examResultSchema.index({ organizationId: 1, studentId: 1, examDate: -1 });
examResultSchema.index({ organizationId: 1, classId: 1, sectionId: 1 });

const ExamResult = mongoose.model('exam_result', examResultSchema, 'exam_result');

export default ExamResult;
