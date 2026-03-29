import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { REGISTRATION_NUMBER_LENGTH, DEFAULT_PASSWORD_LENGTH } from '../constants/index.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Hash password using bcrypt
 */
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};

/**
 * Generate random password
 */
export const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < DEFAULT_PASSWORD_LENGTH; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

/**
 * Generate 16-digit registration number
 */
export const generateRegistrationNumber = () => {
    return Array.from({ length: REGISTRATION_NUMBER_LENGTH }, () => 
        Math.floor(Math.random() * 10)
    ).join('');
};

/**
 * Generate JWT token
 */
export const generateToken = (payload) => {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production';
    const options = {
        expiresIn: process.env.JWT_EXPIRY || '7d'
    };
    return jwt.sign(payload, secret, options);
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
    try {
        const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production';
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};

/**
 * Decode JWT token without verification
 */
export const decodeToken = (token) => {
    return jwt.decode(token);
};

/**
 * Generate filter query based on provided filters
 */
export const buildFilterQuery = (filters, allowedFields) => {
    const query = {};
    
    if (!filters || Object.keys(filters).length === 0) {
        return query;
    }

    for (const [key, value] of Object.entries(filters)) {
        if (allowedFields.includes(key) && value !== undefined && value !== null && value !== '') {
            if (typeof value === 'string') {
                query[key] = { $regex: value, $options: 'i' };
            } else {
                query[key] = value;
            }
        }
    }

    return query;
};

/**
 * Build pagination options
 */
export const buildPaginationOptions = (page = 1, limit = 10) => {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
    
    return {
        skip: (pageNum - 1) * limitNum,
        limit: limitNum,
        page: pageNum
    };
};

/**
 * Format response object
 */
export const formatResponse = (data, message, statusCode = 200) => {
    return {
        success: statusCode < 400,
        statusCode,
        message,
        data
    };
};

/**
 * Extract user info from token safely
 */
export const extractUserFromToken = (token) => {
    const decoded = decodeToken(token);
    if (!decoded) return null;
    
    return {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        organizationId: decoded.organizationId
    };
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate mobile number (Indian format)
 */
export const isValidMobileNumber = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile.toString().trim());
};

/**
 * Validate Aadhar number (12 digits)
 */
export const isValidAadhar = (aadhar) => {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar.toString().trim());
};
