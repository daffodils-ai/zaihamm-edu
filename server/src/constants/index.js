// Constants for the application
export const ROLES = {
    ORGANIZATION: 'organization',
    ADMISSION_STAFF: 'admission_staff',
    TEACHER: 'teacher',
    STAFF: 'staff',
    ACCOUNTANT: 'accountant'
};

export const USER_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
    DELETED: 'deleted'
};

export const FEE_TYPES = {
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
    ADMISSION: 'admission',
    EXAM: 'exam',
    OTHER: 'other'
};

export const FEE_STATUS = {
    PAID: 'paid',
    PENDING: 'pending',
    OVERDUE: 'overdue'
};

export const STUDENT_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    GRADUATED: 'graduated',
    LEFT: 'left'
};

export const AADHAR_RELATION = {
    FATHER: 'father',
    MOTHER: 'mother',
    BROTHER: 'brother',
    SISTER: 'sister',
    OTHER: 'other'
};

export const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden - insufficient permissions',
    NOT_FOUND: 'Resource not found',
    INVALID_CREDENTIALS: 'Invalid credentials',
    EMAIL_EXISTS: 'Email already exists',
    INTERNAL_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation error',
    TOKEN_EXPIRED: 'Token has expired',
    INVALID_TOKEN: 'Invalid token',
    ORGANIZATION_NOT_FOUND: 'Organization not found',
    USER_NOT_FOUND: 'User not found',
    STUDENT_NOT_FOUND: 'Student not found',
    CLASS_NOT_FOUND: 'Class not found',
    SECTION_NOT_FOUND: 'Section not found',
    DUPLICATE_ENTRY: 'Duplicate entry detected',
    INVALID_REQUEST: 'Invalid request format'
};

export const SUCCESS_MESSAGES = {
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    FETCHED: 'Resource fetched successfully',
    LOGIN_SUCCESS: 'Login successful',
    PASSWORD_RESET_SUCCESS: 'Password reset successful',
    PASSWORD_RESET_EMAIL_SENT: 'Password reset email sent'
};

export const HTTP_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500
};

export const REGISTRATION_NUMBER_LENGTH = 16;

export const AUDIT_FIELDS = {
    STATUS: 'status',
    IS_ACTIVE: 'is_active',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at'
};

export const DEFAULT_PASSWORD_LENGTH = 8;

export const FEE_GENERATION_DAY = 27;

export const PAGINATION = {
    LIMIT: 10,
    PAGE: 1
};

export const ALLOWED_ROLES_TO_ADMIT_STUDENT = [
    ROLES.ACCOUNTANT,
    ROLES.ORGANIZATION,
    ROLES.ADMISSION_STAFF
];

export const ALLOWED_ROLES_TO_CREATE_NOTICE = [
    ROLES.ORGANIZATION,
    ROLES.TEACHER,
    ROLES.STAFF
];
