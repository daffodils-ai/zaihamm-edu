import PDFDocument from 'pdfkit';
import Organization from '../model/Organization.js';

const formatDate = (value) => new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
});

class ExamResultPdfService {
    async generate(result) {
        const organization = await Organization.findById(result.organizationId).lean();
        const doc = new PDFDocument({
            size: 'A4',
            margin: 40,
            bufferPages: true
        });

        const buffers = [];
        doc.on('data', (chunk) => buffers.push(chunk));

        const endPromise = new Promise((resolve, reject) => {
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
        });

        this.drawHeader(doc, organization, result);
        this.drawStudentSummary(doc, result);
        this.drawSubjectTable(doc, result);
        this.drawFooter(doc, result);

        doc.end();
        return endPromise;
    }

    drawHeader(doc, organization, result) {
        doc.roundedRect(40, 35, 515, 120, 18).fill('#102542');
        doc.fillColor('#f7f3e9')
            .fontSize(24)
            .font('Helvetica-Bold')
            .text(organization?.name || 'School Result Card', 60, 55, { width: 330 });

        doc.fontSize(11)
            .font('Helvetica')
            .fillColor('#d7e2f0')
            .text(organization?.address || 'Academic Performance Report', 60, 88, { width: 320 });

        doc.roundedRect(395, 55, 135, 62, 14).fill('#f4c95d');
        doc.fillColor('#102542')
            .font('Helvetica-Bold')
            .fontSize(11)
            .text('RESULT STATUS', 422, 70)
            .fontSize(22)
            .text(result.resultStatus.toUpperCase(), 425, 86);

        doc.fillColor('#102542')
            .fontSize(17)
            .font('Helvetica-Bold')
            .text(result.examName, 40, 178);

        doc.font('Helvetica')
            .fontSize(10)
            .fillColor('#486581')
            .text(`Academic Year: ${result.year}`, 40, 202)
            .text(`Exam Date: ${formatDate(result.examDate)}`, 155, 202)
            .text(`Generated On: ${formatDate(new Date())}`, 280, 202);
    }

    drawStudentSummary(doc, result) {
        const y = 232;
        doc.roundedRect(40, y, 515, 86, 16).fill('#f7f9fc');

        const studentName = result.studentId?.fullName || 'Student';
        const registrationNumber = result.studentId?.registrationNumber || '-';
        const className = result.classId?.name || '-';
        const sectionName = result.sectionId?.name || 'N/A';

        doc.fillColor('#102542')
            .font('Helvetica-Bold')
            .fontSize(10)
            .text('STUDENT', 58, y + 18)
            .text('REGISTRATION NO.', 240, y + 18)
            .text('CLASS / SECTION', 410, y + 18);

        doc.fontSize(16)
            .text(studentName, 58, y + 35, { width: 160 })
            .fontSize(13)
            .text(registrationNumber, 240, y + 38, { width: 130 })
            .text(`${className} / ${sectionName}`, 410, y + 38, { width: 110 });

        const cards = [
            { label: 'Obtained', value: `${result.totalObtainedMarks}` },
            { label: 'Total', value: `${result.totalMarks}` },
            { label: 'Percentage', value: `${result.percentage}%` },
            { label: 'Overall Grade', value: result.overallGrade || '-' }
        ];

        let x = 40;
        const cardY = y + 110;
        for (const [index, card] of cards.entries()) {
            const width = 122;
            const bg = index % 2 === 0 ? '#102542' : '#f4c95d';
            const fg = index % 2 === 0 ? '#ffffff' : '#102542';
            doc.roundedRect(x, cardY, width, 62, 14).fill(bg);
            doc.fillColor(fg)
                .font('Helvetica')
                .fontSize(9)
                .text(card.label.toUpperCase(), x + 14, cardY + 15, { width: width - 28, align: 'center' })
                .font('Helvetica-Bold')
                .fontSize(18)
                .text(card.value, x + 14, cardY + 31, { width: width - 28, align: 'center' });
            x += width + 9;
        }
    }

    drawSubjectTable(doc, result) {
        const tableTop = 430;
        const rowHeight = 28;
        const columns = [
            { label: 'Subject', x: 48, width: 170 },
            { label: 'Obtained', x: 230, width: 70 },
            { label: 'Pass', x: 312, width: 60 },
            { label: 'Total', x: 384, width: 60 },
            { label: 'Grade', x: 456, width: 70 }
        ];

        doc.roundedRect(40, tableTop - 8, 515, 34, 12).fill('#102542');
        doc.fillColor('#ffffff')
            .font('Helvetica-Bold')
            .fontSize(10);

        for (const column of columns) {
            doc.text(column.label, column.x, tableTop + 2, { width: column.width, align: column.label === 'Subject' ? 'left' : 'center' });
        }

        let currentY = tableTop + 34;
        result.subjects.forEach((subject, index) => {
            doc.roundedRect(40, currentY - 3, 515, 24, 8).fill(index % 2 === 0 ? '#f7f9fc' : '#edf2f7');
            doc.fillColor('#102542')
                .font(index % 2 === 0 ? 'Helvetica-Bold' : 'Helvetica')
                .fontSize(10)
                .text(subject.subject, 48, currentY + 4, { width: 170 })
                .text(String(subject.obtainedMarks), 230, currentY + 4, { width: 70, align: 'center' })
                .text(String(subject.passMarks), 312, currentY + 4, { width: 60, align: 'center' })
                .text(String(subject.totalMarks), 384, currentY + 4, { width: 60, align: 'center' })
                .text(subject.grade, 456, currentY + 4, { width: 70, align: 'center' });
            currentY += rowHeight;
        });
    }

    drawFooter(doc, result) {
        const footerY = 740;
        doc.strokeColor('#d9e2ec').lineWidth(1).moveTo(40, footerY).lineTo(555, footerY).stroke();
        doc.fillColor('#486581')
            .font('Helvetica')
            .fontSize(10)
            .text(
                result.isFinalized
                    ? `Finalized on ${formatDate(result.finalizedAt)}. This result card is system generated.`
                    : 'This result card is system generated and pending final verification.',
                40,
                footerY + 12,
                { width: 350 }
            );
        doc.fillColor('#102542')
            .font('Helvetica-Bold')
            .text('Authorized Signature', 420, footerY + 28);
    }
}

export default new ExamResultPdfService();
