import OrganizationRepository from '../repository/OrganizationRepository.js';
import OrganizationUserRepository from '../repository/OrganizationUserRepository.js';
import { hashPassword, generateToken } from '../utils/index.js';
import { ApiError } from '../utils/error.js';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, HTTP_CODES, ROLES, USER_STATUS, STUDENT_STATUS } from '../constants/index.js';
import { Logger } from '../logger/logger.js';

/**
 * Service for Organization signup and management
 */
class OrganizationService {
    /**
     * Sign up new organization with admin user
     */
    async signupOrganization(data) {
        try {
            const { name, email, mobile, address, firstName, lastName, adminEmail, adminPassword, adminMobile } = data;

            // Validate required fields
            if (!name || !email || !mobile || !address || !firstName || !lastName || !adminEmail || !adminPassword) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_REQUEST);
            }

            // Check if organization already exists
            const existingOrg = await OrganizationRepository.findByEmail(email);
            if (existingOrg) {
                throw new ApiError(HTTP_CODES.CONFLICT, ERROR_MESSAGES.EMAIL_EXISTS);
            }

            // Check if admin email already exists
            const existingAdmin = await OrganizationUserRepository.findByEmail(adminEmail);
            if (existingAdmin) {
                throw new ApiError(HTTP_CODES.CONFLICT, 'Admin email already registered');
            }

            // Create organization
            const organization = await OrganizationRepository.create({
                name,
                email,
                mobile,
                address,
                status: USER_STATUS.ACTIVE,
                isActive: true
            });

            Logger.log(`Organization created: ${email}`, Logger.Level.INFO);

            // Hash admin password
            const hashedPassword = await hashPassword(adminPassword);

            // Create organization admin user
            const adminUser = await OrganizationUserRepository.create({
                organizationId: organization._id,
                firstName,
                lastName,
                email: adminEmail,
                mobile: adminMobile || mobile,
                password: hashedPassword,
                role: ROLES.ORGANIZATION,
                status: USER_STATUS.ACTIVE,
                isActive: true
            });

            Logger.log(`Organization admin user created: ${adminEmail}`, Logger.Level.INFO);

            // Generate token for immediate login
            const token = generateToken({
                id: adminUser._id,
                email: adminUser.email,
                role: adminUser.role,
                organizationId: organization._id
            });

            return {
                organization: {
                    id: organization._id,
                    name: organization.name,
                    email: organization.email,
                    mobile: organization.mobile,
                    address: organization.address
                },
                admin: {
                    id: adminUser._id,
                    firstName: adminUser.firstName,
                    lastName: adminUser.lastName,
                    email: adminUser.email,
                    role: adminUser.role
                },
                token
            };
        } catch (error) {
            Logger.log(`Error signing up organization: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    /**
     * Get organization by ID
     */
    async getOrganizationById(id) {
        try {
            const organization = await OrganizationRepository.findById(id);
            if (!organization) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, ERROR_MESSAGES.ORGANIZATION_NOT_FOUND);
            }
            return organization;
        } catch (error) {
            Logger.log(`Error fetching organization: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    /**
     * Get all organizations
     */
    async getAllOrganizations(filters = {}, page = 1, limit = 10) {
        try {
            return await OrganizationRepository.findAll(filters, page, limit);
        } catch (error) {
            Logger.log(`Error fetching organizations: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    /**
     * Update organization
     */
    async updateOrganization(id, data) {
        try {
            const organization = await OrganizationRepository.update(id, data);
            if (!organization) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, ERROR_MESSAGES.ORGANIZATION_NOT_FOUND);
            }
            Logger.log(`Organization updated: ${id}`, Logger.Level.INFO);
            return organization;
        } catch (error) {
            Logger.log(`Error updating organization: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    /**
     * Delete organization
     */
    async deleteOrganization(id) {
        try {
            const organization = await OrganizationRepository.delete(id);
            if (!organization) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, ERROR_MESSAGES.ORGANIZATION_NOT_FOUND);
            }
            Logger.log(`Organization deleted: ${id}`, Logger.Level.INFO);
            return organization;
        } catch (error) {
            Logger.log(`Error deleting organization: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }
}

export default new OrganizationService();
