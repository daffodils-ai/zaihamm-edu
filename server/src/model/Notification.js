import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization_user'
    },
    type: {
        type: String,
        enum: ['fee', 'notice', 'general'],
        default: 'general'
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true
    },
    mobile: {
        type: String,
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    sentAt: {
        type: Date,
        default: Date.now
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
    collection: 'notification'
});

notificationSchema.index({ organizationId: 1, createdAt: -1 });
notificationSchema.index({ studentId: 1, isRead: 1 });

const Notification = mongoose.model('notification', notificationSchema, 'notification');

export default Notification;
