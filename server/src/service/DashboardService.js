import Student from '../model/Student.js';
import Fee from '../model/Fee.js';
import Class from '../model/Class.js';
import Section from '../model/Section.js';
import NoticeBoard from '../model/NoticeBoard.js';
import StudentRepository from '../repository/StudentRepository.js';
import FeeRepository from '../repository/FeeRepository.js';
import ClassRepository from '../repository/ClassRepository.js';
import SectionRepository from '../repository/SectionRepository.js';
import NoticeBoardRepository from '../repository/NoticeBoardRepository.js';
import { Logger } from '../logger/logger.js';
import { ApiError } from '../utils/error.js';

class DashboardService {
    /**
     * Get admission analytics based on date filters
     */
    async getAdmissionAnalytics(organizationId, filters = {}) {
        try {
            const { startDate, endDate } = filters;
            const query = { organizationId };

            if (startDate || endDate) {
                query.createdAt = {};
                if (startDate) query.createdAt.$gte = new Date(startDate);
                if (endDate) {
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999);
                    query.createdAt.$lte = end;
                }
            }

            const totalAdmissions = await Student.countDocuments(query);
            const activeStudents = await Student.countDocuments({
                ...query,
                status: 'active'
            });
            const inactiveStudents = await Student.countDocuments({
                ...query,
                status: 'inactive'
            });

            return {
                totalAdmissions,
                activeStudents,
                inactiveStudents,
                admissionRate: totalAdmissions > 0 ? ((activeStudents / totalAdmissions) * 100).toFixed(2) : 0
            };
        } catch (error) {
            Logger.error('Error in getAdmissionAnalytics:', error);
            throw new ApiError('Failed to fetch admission analytics', 500);
        }
    }

    /**
     * Get revenue analytics based on fees
     */
    async getRevenueAnalytics(organizationId, filters = {}) {
        try {
            const { startDate, endDate } = filters;
            const query = { organizationId };

            if (startDate || endDate) {
                query.createdAt = {};
                if (startDate) query.createdAt.$gte = new Date(startDate);
                if (endDate) {
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999);
                    query.createdAt.$lte = end;
                }
            }

            // Total fees
            const allFees = await Fee.find(query);
            const totalFeesAmount = allFees.reduce((sum, fee) => sum + (fee.amount || 0), 0);

            // Paid fees
            const paidFees = await Fee.find({ ...query, status: 'paid' });
            const paidAmount = paidFees.reduce((sum, fee) => sum + (fee.amount || 0), 0);

            // Pending fees
            const pendingAmount = totalFeesAmount - paidAmount;

            const paidPercentage = totalFeesAmount > 0 ? ((paidAmount / totalFeesAmount) * 100).toFixed(2) : 0;

            return {
                totalFeesAmount,
                paidAmount,
                pendingAmount,
                paidPercentage,
                totalFeeRecords: allFees.length,
                paidRecords: paidFees.length
            };
        } catch (error) {
            Logger.error('Error in getRevenueAnalytics:', error);
            throw new ApiError('Failed to fetch revenue analytics', 500);
        }
    }

    /**
     * Get notice board analytics
     */
    async getNoticeAnalytics(organizationId) {
        try {
            const query = { organizationId };
            const totalNotices = await NoticeBoard.countDocuments(query);
            const recentNotices = await NoticeBoard.countDocuments({
                ...query,
                createdAt: {
                    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                }
            });

            return {
                totalNotices,
                recentNotices,
                noticeRate: totalNotices > 0 ? ((recentNotices / totalNotices) * 100).toFixed(2) : 0
            };
        } catch (error) {
            Logger.error('Error in getNoticeAnalytics:', error);
            throw new ApiError('Failed to fetch notice analytics', 500);
        }
    }

    /**
     * Get student count analytics
     */
    async getStudentAnalytics(organizationId, filters = {}) {
        try {
            const { classId, sectionId } = filters;
            const query = { organizationId };

            if (classId) query.classId = classId;
            if (sectionId) query.sectionId = sectionId;

            const totalStudents = await Student.countDocuments(query);
            const activeStudents = await Student.countDocuments({
                ...query,
                status: 'active'
            });

            return {
                totalStudents,
                activeStudents,
                inactiveStudents: totalStudents - activeStudents
            };
        } catch (error) {
            Logger.error('Error in getStudentAnalytics:', error);
            throw new ApiError('Failed to fetch student analytics', 500);
        }
    }

    /**
     * Get class count analytics
     */
    async getClassAnalytics(organizationId) {
        try {
            const totalClasses = await Class.countDocuments({ organizationId });

            // Get class-wise student distribution
            const classes = await Class.find(
                { organizationId },
                { name: 1, createdAt: 1 }
            ).sort({ createdAt: -1 }).limit(100);

            const classAnalytics = await Promise.all(
                classes.map(async (cls) => {
                    const studentCount = await Student.countDocuments({
                        classId: cls._id,
                        organizationId
                    });
                    return {
                        classId: cls._id,
                        className: cls.name,
                        studentCount
                    };
                })
            );

            return {
                totalClasses,
                classAnalytics
            };
        } catch (error) {
            Logger.error('Error in getClassAnalytics:', error);
            throw new ApiError('Failed to fetch class analytics', 500);
        }
    }

    /**
     * Get section count analytics
     */
    async getSectionAnalytics(organizationId) {
        try {
            const totalSections = await Section.countDocuments({ organizationId });

            // Get section-wise student distribution
            const sections = await Section.find(
                { organizationId },
                { name: 1, classId: 1 }
            ).limit(100);

            const sectionAnalytics = await Promise.all(
                sections.map(async (section) => {
                    const studentCount = await Student.countDocuments({
                        sectionId: section._id,
                        organizationId
                    });
                    return {
                        sectionId: section._id,
                        sectionName: section.name,
                        classId: section.classId,
                        studentCount
                    };
                })
            );

            return {
                totalSections,
                sectionAnalytics
            };
        } catch (error) {
            Logger.error('Error in getSectionAnalytics:', error);
            throw new ApiError('Failed to fetch section analytics', 500);
        }
    }

    /**
     * Get complete dashboard summary
     */
    async getDashboardSummary(organizationId, filters = {}) {
        try {
            const [admission, revenue, notices, students, classes, sections] = await Promise.all([
                this.getAdmissionAnalytics(organizationId, filters),
                this.getRevenueAnalytics(organizationId, filters),
                this.getNoticeAnalytics(organizationId),
                this.getStudentAnalytics(organizationId, filters),
                this.getClassAnalytics(organizationId),
                this.getSectionAnalytics(organizationId)
            ]);

            return {
                admission,
                revenue,
                notices,
                students,
                classes,
                sections,
                generatedAt: new Date()
            };
        } catch (error) {
            Logger.error('Error in getDashboardSummary:', error);
            throw new ApiError('Failed to fetch dashboard summary', 500);
        }
    }
}

export default new DashboardService();
