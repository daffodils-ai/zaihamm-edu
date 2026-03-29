import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
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
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'menu',
        default: null
    },
    url: {
        type: String,
        trim: true
    },
    icon: {
        type: String,
        trim: true
    },
    order: {
        type: Number,
        default: 0
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
    collection: 'menu'
});

menuSchema.index({ organizationId: 1, parentId: 1 });

const Menu = mongoose.model('menu', menuSchema, 'menu');

export default Menu;
