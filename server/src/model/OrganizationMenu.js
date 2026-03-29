import mongoose from 'mongoose';

const organizationMenuSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization',
        required: true
    },
    menuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'menu',
        required: true
    },
    role: {
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
    collection: 'organization_menu'
});

organizationMenuSchema.index({ organizationId: 1, role: 1 });

const OrganizationMenu = mongoose.model('organization_menu', organizationMenuSchema, 'organization_menu');

export default OrganizationMenu;
