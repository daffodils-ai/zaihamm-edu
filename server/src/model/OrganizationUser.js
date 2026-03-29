import mongoose from 'mongoose';
import { ROLES, USER_STATUS } from '../constants/index.js';

const organizationUserSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization',
        required: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(ROLES),
        required: true,
        default: ROLES.STAFF
    },
    status: {
        type: String,
        enum: Object.values(USER_STATUS),
        default: USER_STATUS.ACTIVE
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
    collection: 'organization_user'
});

organizationUserSchema.index({ organizationId: 1, email: 1 });
organizationUserSchema.index({ organizationId: 1, mobile: 1 });

const OrganizationUser = mongoose.model('organization_user', organizationUserSchema, 'organization_user');

export default OrganizationUser;
