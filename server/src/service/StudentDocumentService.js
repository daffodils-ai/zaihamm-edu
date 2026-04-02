import PDFDocument from 'pdfkit';
import Organization from '../model/Organization.js';

const CARD = {
    width: 340,
    height: 214
};

const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

const safeText = (value, fallback = '-') => `${value || ''}`.trim() || fallback;

class StudentDocumentService {
    async generateIdCard(student, latestSession) {
        const organization = await Organization.findById(student.organizationId).lean();
        const doc = new PDFDocument({
            size: [CARD.width, CARD.height],
            margin: 0
        });

        const buffers = [];
        doc.on('data', (chunk) => buffers.push(chunk));

        const endPromise = new Promise((resolve, reject) => {
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
        });

        doc.rect(0, 0, CARD.width, CARD.height).fill('#f5f8fc');
        doc.roundedRect(14, 14, CARD.width - 28, CARD.height - 28, 18).fillAndStroke('#ffffff', '#c8d6e5');
        doc.rect(14, 14, CARD.width - 28, 54).fill('#12355b');

        doc.fillColor('#ffffff')
            .font('Helvetica-Bold')
            .fontSize(16)
            .text(organization?.name || 'School Name', 28, 28, { width: CARD.width - 56 });

        doc.font('Helvetica')
            .fontSize(9)
            .text('Student Identity Card', 28, 48);

        const imageBoxX = 28;
        const imageBoxY = 88;
        const imageBoxSize = 72;

        doc.roundedRect(imageBoxX, imageBoxY, imageBoxSize, imageBoxSize, 8).fillAndStroke('#eef3f8', '#d6e0ea');
        if (student.studentPic) {
            try {
                doc.image(student.studentPic, imageBoxX + 4, imageBoxY + 4, {
                    fit: [imageBoxSize - 8, imageBoxSize - 8],
                    align: 'center',
                    valign: 'center'
                });
            } catch {
                doc.fillColor('#7b8794').fontSize(8).text('PHOTO', imageBoxX + 20, imageBoxY + 30);
            }
        } else {
            doc.fillColor('#7b8794').fontSize(8).text('PHOTO', imageBoxX + 20, imageBoxY + 30);
        }

        const detailsX = 118;
        const rows = [
            ['Name', safeText(student.fullName)],
            ['Reg. No.', safeText(student.registrationNumber)],
            ['Class', safeText(latestSession?.classId?.name)],
            ['Section', safeText(latestSession?.sectionId?.name, 'N/A')],
            ['Session', safeText(latestSession?.year)],
            ['DOB', formatDate(student.dateOfBirth)]
        ];

        let y = 84;
        rows.forEach(([label, value]) => {
            doc.fillColor('#52606d')
                .font('Helvetica-Bold')
                .fontSize(8)
                .text(label.toUpperCase(), detailsX, y);
            doc.fillColor('#102a43')
                .font('Helvetica')
                .fontSize(10)
                .text(value, detailsX + 64, y, { width: 130 });
            y += 18;
        });

        doc.moveTo(28, 182).lineTo(CARD.width - 28, 182).strokeColor('#d9e2ec').stroke();
        doc.fillColor('#52606d')
            .font('Helvetica')
            .fontSize(8)
            .text(`Issued on ${formatDate(new Date())}`, 28, 190)
            .text('Authorized by school administration', 170, 190, { width: 140, align: 'right' });

        doc.end();
        return endPromise;
    }
}

export default new StudentDocumentService();
