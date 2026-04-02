import PDFDocument from 'pdfkit';
import Organization from '../model/Organization.js';

const CERTIFICATE_LABELS = {
    bonafide: 'Bonafide Certificate',
    character: 'Character Certificate',
    transfer: 'Transfer Certificate',
    admit_card: 'Admit Card'
};

const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

const safe = (value, fallback = '-') => `${value || ''}`.trim() || fallback;

class CertificatePdfService {
    async generate(record) {
        const organization = await Organization.findById(record.organizationId).lean();
        const doc = new PDFDocument({
            size: 'A4',
            margin: 54
        });

        const buffers = [];
        doc.on('data', (chunk) => buffers.push(chunk));

        const endPromise = new Promise((resolve, reject) => {
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
        });

        const title = CERTIFICATE_LABELS[record.certificateName] || 'Certificate';
        const student = record.studentId || {};
        const className = record.classId?.name || '-';
        const sectionName = record.sectionId?.name || 'N/A';

        doc.rect(0, 0, doc.page.width, 120).fill('#f4f7fb');
        doc.roundedRect(28, 28, doc.page.width - 56, doc.page.height - 56, 20).strokeColor('#cdd8e3').lineWidth(1.5).stroke();

        doc.fillColor('#16324f')
            .font('Helvetica-Bold')
            .fontSize(22)
            .text(organization?.name || 'School Name', 54, 54, { align: 'center' });

        doc.font('Helvetica')
            .fontSize(10)
            .fillColor('#52606d')
            .text(organization?.address || 'School Address', 54, 82, { align: 'center' });

        doc.moveDown(3);
        doc.fillColor('#102a43')
            .font('Helvetica-Bold')
            .fontSize(20)
            .text(title, { align: 'center', underline: true });

        doc.moveDown(1.8);

        const bodyText = this.getBodyText(record.certificateName, {
            studentName: safe(student.fullName),
            fatherName: safe(student.fatherName, 'his/her parent'),
            registrationNumber: safe(student.registrationNumber),
            className: safe(className),
            sectionName: safe(sectionName, 'N/A')
        });

        doc.font('Helvetica')
            .fontSize(12)
            .fillColor('#1f2933')
            .text(bodyText, {
                align: 'justify',
                lineGap: 5
            });

        doc.moveDown(1.2);
        doc.font('Helvetica-Bold')
            .text('Remarks:', { continued: true })
            .font('Helvetica')
            .text(` ${safe(record.remarks, 'N/A')}`);

        doc.moveDown(1.5);
        doc.font('Helvetica')
            .fontSize(11)
            .text(`Student Name: ${safe(student.fullName)}`)
            .text(`Registration Number: ${safe(student.registrationNumber)}`)
            .text(`Class / Section: ${safe(className)} / ${safe(sectionName, 'N/A')}`)
            .text(`Date of Birth: ${formatDate(student.dateOfBirth)}`)
            .text(`Issue Date: ${formatDate(record.createdAt)}`);

        doc.moveDown(4);
        doc.text('__________________________', { align: 'right' });
        doc.font('Helvetica-Bold').text('Authorized Signature', { align: 'right' });

        doc.end();
        return endPromise;
    }

    getBodyText(type, data) {
        switch (type) {
        case 'character':
            return `This is to certify that ${data.studentName}, child of ${data.fatherName}, bearing registration number ${data.registrationNumber}, is or was a student of Class ${data.className}${data.sectionName !== 'N/A' ? `, Section ${data.sectionName}` : ''} in this institution. During the period of study, the student has maintained satisfactory conduct and character to the best of our knowledge.`;
        case 'transfer':
            return `This is to certify that ${data.studentName}, child of ${data.fatherName}, registration number ${data.registrationNumber}, studied in Class ${data.className}${data.sectionName !== 'N/A' ? `, Section ${data.sectionName}` : ''} of this institution. The Transfer Certificate is being issued on request for official academic purposes.`;
        case 'admit_card':
            return `This admit card is issued to ${data.studentName}, registration number ${data.registrationNumber}, for appearing in the scheduled examination as a student of Class ${data.className}${data.sectionName !== 'N/A' ? `, Section ${data.sectionName}` : ''}. The student must carry this document during all examination days and comply with school instructions.`;
        case 'bonafide':
        default:
            return `This is to certify that ${data.studentName}, child of ${data.fatherName}, registration number ${data.registrationNumber}, is a bonafide student of this institution and is presently studying in Class ${data.className}${data.sectionName !== 'N/A' ? `, Section ${data.sectionName}` : ''}. This certificate is issued on the student's request for official purposes.`;
        }
    }
}

export default new CertificatePdfService();
