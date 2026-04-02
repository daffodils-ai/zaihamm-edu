import OrganizationUserRepository from '../repository/OrganizationUserRepository.js';
import { hashPassword, comparePassword, generateToken } from '../utils/index.js';
import { ApiError } from '../utils/error.js';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, HTTP_CODES } from '../constants/index.js';
import { Logger } from '../logger/logger.js';

/**
 * Service for Organization User authentication and management
 */
class OrganizationUserService {
    /**
     * Create new organization user
     */
    async createUser(data) {
        try {
            // Check if user already exists
            const existingUser = await OrganizationUserRepository.findByEmail(
                data.email,
                data.organizationId
            );
            if (existingUser) {
                throw new ApiError(HTTP_CODES.CONFLICT, ERROR_MESSAGES.EMAIL_EXISTS);
            }

            // Hash password
            const hashedPassword = await hashPassword(data.password);
            data.password = hashedPassword;

            const user = await OrganizationUserRepository.create(data);
            Logger.log(`Organization user created: ${data.email}`, Logger.Level.INFO);
            return user;
        } catch (error) {
            Logger.log(`Error creating organization user: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    /**
     * Login organization user - email and password only
     */
    async login(email, password, organizationId = null) {
        try {
            const user = await OrganizationUserRepository.findByEmailWithPassword(email);

            if (!user) {
                throw new ApiError(HTTP_CODES.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
            }

            // If organizationId is provided, verify it matches (for backward compatibility)
            if (organizationId && user.organizationId.toString() !== organizationId.toString()) {
                throw new ApiError(HTTP_CODES.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
            }

            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                throw new ApiError(HTTP_CODES.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
            }

            const token = generateToken({
                id: user._id,
                email: user.email,
                role: user.role,
                organizationId: user.organizationId
            });

            Logger.log(`Organization user logged in: ${email}`, Logger.Level.INFO);
            return {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                }
            };
        } catch (error) {
            Logger.log(`Error logging in organization user: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    /**
     * Get user by ID
     */
    async getUserById(id) {
        try {
            const user = await OrganizationUserRepository.findById(id);
            if (!user) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
            }
            return user;
        } catch (error) {
            Logger.log(`Error fetching user: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    /**
     * Get all users for organization
     */
    async getAllUsers(organizationId, filters = {}, page = 1, limit = 10) {
        try {
            return await OrganizationUserRepository.findAll(organizationId, filters, page, limit);
        } catch (error) {
            Logger.log(`Error fetching users: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    /**
     * Update user
     */
    async updateUser(id, data) {
        try {
            const user = await OrganizationUserRepository.update(id, data);
            if (!user) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
            }
            Logger.log(`Organization user updated: ${id}`, Logger.Level.INFO);
            return user;
        } catch (error) {
            Logger.log(`Error updating user: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    /**
     * Delete user
     */
    async deleteUser(id) {
        try {
            const user = await OrganizationUserRepository.delete(id);
            if (!user) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
            }
            Logger.log(`Organization user deleted: ${id}`, Logger.Level.INFO);
            return user;
        } catch (error) {
            Logger.log(`Error deleting user: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    /**
     * Reset password
     */
    async resetPassword(userId, newPassword) {
        try {
            const hashedPassword = await hashPassword(newPassword);
            const user = await OrganizationUserRepository.updatePassword(userId, hashedPassword);
            if (!user) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
            }
            Logger.log(`Organization user password reset: ${userId}`, Logger.Level.INFO);
            return { message: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS };
        } catch (error) {
            Logger.log(`Error resetting password: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }
}

export default new OrganizationUserService();
