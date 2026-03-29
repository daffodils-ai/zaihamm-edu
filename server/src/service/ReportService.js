import Student from '../model/Student.js';
import Fee from '../model/Fee.js';
import Class from '../model/Class.js';
import Section from '../model/Section.js';
import { Logger } from '../logger/logger.js';
import { ApiError } from '../utils/error.js';

class ReportService {
    /**
     * Get admission report data based on filters
     */
    async getAdmissionReportData(filters = {}) {
        try {
            const {
                startDate,
                endDate,
                registrationNumber,
                classId,
                sectionId,
                organizationId,
                status
            } = filters;

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

            if (registrationNumber) {
                query.registrationNumber = registrationNumber;
            }

            if (classId) {
                query.classId = classId;
            }

            if (sectionId) {
                query.sectionId = sectionId;
            }

            if (status) {
                query.status = status;
            }

            const students = await Student.find(query).sort({ createdAt: -1 }).limit(10000);

            // Enrich data with related information
            const enrichedData = await Promise.all(
                students.map(async (student) => {
                    const classData = student.classId ? 
                        await Class.findById(student.classId) : null;
                    const sectionData = student.sectionId ? 
                        await Section.findById(student.sectionId) : null;

                    return {
                        'Registration Number': student.registrationNumber || 'N/A',
                        'Full Name': student.fullName || 'N/A',
                        'Email': student.email || 'N/A',
                        'Mobile': student.mobile || 'N/A',
                        'Age': student.age || 'N/A',
                        'Blood Group': student.bloodGroup || 'N/A',
                        'Class': classData?.name || 'N/A',
                        'Section': sectionData?.name || 'N/A',
                        'Father Name': student.fatherName || 'N/A',
                        'Mother Name': student.motherName || 'N/A',
                        'Guardian Name': student.guardianName || 'N/A',
                        'Address': student.fullAddress || 'N/A',
                        'Status': student.status || 'N/A',
                        'Admission Date': student.createdAt ? 
                            new Date(student.createdAt).toLocaleDateString('en-IN') : 'N/A'
                    };
                })
            );

            return enrichedData;
        } catch (error) {
            Logger.error('Error in getAdmissionReportData:', error);
            throw new ApiError('Failed to fetch admission report data', 500);
        }
    }

    /**
     * Get fee report data based on filters
     */
    async getFeeReportData(filters = {}) {
        try {
            const {
                startDate,
                endDate,
                registrationNumber,
                classId,
                sectionId,
                organizationId,
                status
            } = filters;

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

            if (status) {
                query.status = status;
            }

            const fees = await Fee.find(query).sort({ createdAt: -1 }).limit(10000);

            // Enrich data with student and class information
            const enrichedData = await Promise.all(
                fees.map(async (fee) => {
                    const student = fee.studentId ? 
                        await Student.findById(fee.studentId) : null;
                    const classData = fee.classId ? 
                        await Class.findById(fee.classId) : null;

                    // Apply additional filters
                    if (registrationNumber && student?.registrationNumber !== registrationNumber) {
                        return null;
                    }

                    if (classId && fee.classId?.toString() !== classId) {
                        return null;
                    }

                    if (sectionId && fee.sectionId?.toString() !== sectionId) {
                        return null;
                    }

                    return {
                        'Registration Number': student?.registrationNumber || 'N/A',
                        'Student Name': student?.fullName || 'N/A',
                        'Class': classData?.name || 'N/A',
                        'Fee Type': fee.type || 'N/A',
                        'Amount': fee.amount || 0,
                        'Status': fee.status || 'N/A',
                        'Due Date': fee.dueDate ? 
                            new Date(fee.dueDate).toLocaleDateString('en-IN') : 'N/A',
                        'Paid Date': fee.paidDate ? 
                            new Date(fee.paidDate).toLocaleDateString('en-IN') : 'N/A',
                        'Remarks': fee.remarks || 'N/A',
                        'Created Date': fee.createdAt ? 
                            new Date(fee.createdAt).toLocaleDateString('en-IN') : 'N/A'
                    };
                })
            );

            return enrichedData.filter(item => item !== null);
        } catch (error) {
            Logger.error('Error in getFeeReportData:', error);
            throw new ApiError('Failed to fetch fee report data', 500);
        }
    }

    /**
     * Convert data to CSV format
     */
    dataToCSV(data) {
        if (!data || data.length === 0) {
            return 'No data available';
        }

        const headers = Object.keys(data[0]);
        const csvHeaders = headers.join(',');
        
        const csvRows = data.map(row => {
            return headers.map(header => {
                const value = row[header];
                const escapedValue = String(value)
                    .replace(/"/g, '""')
                    .replace(/\n/g, ' ')
                    .replace(/\r/g, ' ');
                return `"${escapedValue}"`;
            }).join(',');
        });

        return [csvHeaders, ...csvRows].join('\n');
    }

    /**
     * Convert data to simple JSON format for potential Excel conversion
     */
    dataToJSON(data) {
        return JSON.stringify(data, null, 2);
    }
}

export default new ReportService();
