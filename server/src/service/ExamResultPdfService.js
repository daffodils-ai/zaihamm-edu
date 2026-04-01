import PDFDocument from 'pdfkit';
import Organization from '../model/Organization.js';

const COLORS = {
    primary: '#16324f',
    primarySoft: '#eaf1f8',
    text: '#1f2933',
    muted: '#52606d',
    border: '#d9e2ec',
    surface: '#f8fafc',
    success: '#1f7a4c',
    danger: '#b42318',
    white: '#ffffff'
};

const PAGE = {
    margin: 40,
    footerHeight: 42
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

const formatValue = (value, suffix = '') => {
    if (value === null || value === undefined || value === '') {
        return '-';
    }

    return `${value}${suffix}`;
};

class ExamResultPdfService {
    async generate(result) {
        const organization = await Organization.findById(result.organizationId).lean();
        const doc = new PDFDocument({
            size: 'A4',
            margin: PAGE.margin,
            bufferPages: true
        });

        const buffers = [];
        doc.on('data', (chunk) => buffers.push(chunk));

        const endPromise = new Promise((resolve, reject) => {
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
        });

        let y = this.drawHeader(doc, organization, result);
        y = this.drawStudentSection(doc, result, y + 18);
        y = this.drawSummarySection(doc, result, y + 18);
        y = this.drawSubjectTable(doc, result, organization, y + 22);
        y = this.drawRemarksSection(doc, result, organization, y + 20);
        this.drawSignatureSection(doc, result, organization, y + 20);
        this.drawPageFooters(doc, organization, result);

        doc.end();
        return endPromise;
    }

    getContentWidth(doc) {
        return doc.page.width - (PAGE.margin * 2);
    }

    getBottomLimit(doc) {
        return doc.page.height - PAGE.margin - PAGE.footerHeight;
    }

    ensureSpace(doc, requiredHeight, organization, result, options = {}) {
        if (doc.y + requiredHeight <= this.getBottomLimit(doc)) {
            return doc.y;
        }

        doc.addPage();
        this.drawContinuationHeader(doc, organization, result, options.title || 'Exam Result');
        return doc.y;
    }

    drawHeader(doc, organization, result) {
        const width = this.getContentWidth(doc);
        const statusText = result.resultStatus === 'pass' ? 'PASSED' : 'FAILED';
        const statusColor = result.resultStatus === 'pass' ? COLORS.success : COLORS.danger;

        doc.roundedRect(PAGE.margin, PAGE.margin, width, 110, 10)
            .fill(COLORS.primary);

        doc.fillColor(COLORS.white)
            .font('Helvetica-Bold')
            .fontSize(20)
            .text(organization?.name || 'School Name', PAGE.margin + 20, PAGE.margin + 16, {
                width: width - 180
            });

        doc.font('Helvetica')
            .fontSize(9)
            .text(organization?.address || 'Academic Result Statement', PAGE.margin + 20, PAGE.margin + 44, {
                width: width - 180
            });

        doc.font('Helvetica-Bold')
            .fontSize(16)
            .text('EXAM RESULT', PAGE.margin + 20, PAGE.margin + 74);

        doc.roundedRect(PAGE.margin + width - 130, PAGE.margin + 22, 110, 50, 8)
            .fill(COLORS.white);

        doc.fillColor(statusColor)
            .font('Helvetica-Bold')
            .fontSize(9)
            .text('RESULT STATUS', PAGE.margin + width - 118, PAGE.margin + 33, {
                width: 86,
                align: 'center'
            })
            .fontSize(16)
            .text(statusText, PAGE.margin + width - 118, PAGE.margin + 48, {
                width: 86,
                align: 'center'
            });

        const metaTop = PAGE.margin + 128;
        doc.fillColor(COLORS.text)
            .font('Helvetica-Bold')
            .fontSize(15)
            .text(result.examName || 'Examination', PAGE.margin, metaTop);

        const metaItems = [
            `Academic Year: ${formatValue(result.year)}`,
            `Exam Date: ${formatDate(result.examDate)}`,
            `Generated On: ${formatDate(new Date())}`
        ];

        doc.font('Helvetica')
            .fontSize(9)
            .fillColor(COLORS.muted)
            .text(metaItems.join('   |   '), PAGE.margin, metaTop + 22, { width });

        doc.moveTo(PAGE.margin, metaTop + 42)
            .lineTo(PAGE.margin + width, metaTop + 42)
            .lineWidth(1)
            .strokeColor(COLORS.border)
            .stroke();

        return metaTop + 50;
    }

    drawContinuationHeader(doc, organization, result, title) {
        const width = this.getContentWidth(doc);

        doc.fillColor(COLORS.primary)
            .font('Helvetica-Bold')
            .fontSize(13)
            .text(organization?.name || 'School Name', PAGE.margin, PAGE.margin, {
                width: width / 2
            });

        doc.fillColor(COLORS.muted)
            .font('Helvetica')
            .fontSize(9)
            .text(result.examName || title, PAGE.margin, PAGE.margin + 18, {
                width: width / 2
            });

        doc.fillColor(COLORS.primary)
            .font('Helvetica-Bold')
            .fontSize(11)
            .text(title, PAGE.margin + width - 160, PAGE.margin + 8, {
                width: 160,
                align: 'right'
            });

        doc.moveTo(PAGE.margin, PAGE.margin + 36)
            .lineTo(PAGE.margin + width, PAGE.margin + 36)
            .lineWidth(1)
            .strokeColor(COLORS.border)
            .stroke();

        doc.y = PAGE.margin + 50;
    }

    drawInfoGrid(doc, title, items, startY) {
        const width = this.getContentWidth(doc);
        const boxHeight = 88;
        const colWidth = (width - 30) / 2;
        const rowGap = 10;

        doc.roundedRect(PAGE.margin, startY, width, boxHeight, 8)
            .fillAndStroke(COLORS.surface, COLORS.border);

        doc.fillColor(COLORS.primary)
            .font('Helvetica-Bold')
            .fontSize(11)
            .text(title, PAGE.margin + 16, startY + 12);

        items.forEach((item, index) => {
            const column = index % 2;
            const row = Math.floor(index / 2);
            const x = PAGE.margin + 16 + (column * (colWidth + 14));
            const y = startY + 34 + (row * rowGap * 2);

            doc.fillColor(COLORS.muted)
                .font('Helvetica-Bold')
                .fontSize(8)
                .text(item.label.toUpperCase(), x, y, { width: colWidth });

            doc.fillColor(COLORS.text)
                .font('Helvetica')
                .fontSize(10)
                .text(item.value, x, y + 12, { width: colWidth });
        });

        return startY + boxHeight;
    }

    drawStudentSection(doc, result, startY) {
        const student = result.studentId || {};
        const className = result.classId?.name || '-';
        const classCode = result.classId?.classCode || '-';
        const sectionName = result.sectionId?.name || 'N/A';

        return this.drawInfoGrid(doc, 'Student Details', [
            { label: 'Student Name', value: formatValue(student.fullName) },
            { label: 'Registration Number', value: formatValue(student.registrationNumber) },
            { label: 'Class', value: `${className}` },
            { label: 'Section / Code', value: `${sectionName} / ${classCode}` }
        ], startY);
    }

    drawSummarySection(doc, result, startY) {
        const width = this.getContentWidth(doc);
        const cardGap = 10;
        const cardWidth = (width - (cardGap * 3)) / 4;
        const cardHeight = 66;
        const cards = [
            { label: 'Obtained Marks', value: formatValue(result.totalObtainedMarks) },
            { label: 'Total Marks', value: formatValue(result.totalMarks) },
            { label: 'Percentage', value: formatValue(result.percentage, '%') },
            { label: 'Overall Grade', value: formatValue(result.overallGrade) }
        ];

        doc.fillColor(COLORS.primary)
            .font('Helvetica-Bold')
            .fontSize(11)
            .text('Performance Summary', PAGE.margin, startY);

        let x = PAGE.margin;
        const boxY = startY + 16;

        cards.forEach((card) => {
            doc.roundedRect(x, boxY, cardWidth, cardHeight, 8)
                .fillAndStroke(COLORS.primarySoft, COLORS.border);

            doc.fillColor(COLORS.muted)
                .font('Helvetica-Bold')
                .fontSize(8)
                .text(card.label.toUpperCase(), x + 10, boxY + 12, {
                    width: cardWidth - 20,
                    align: 'center'
                });

            doc.fillColor(COLORS.primary)
                .font('Helvetica-Bold')
                .fontSize(18)
                .text(card.value, x + 10, boxY + 30, {
                    width: cardWidth - 20,
                    align: 'center'
                });

            x += cardWidth + cardGap;
        });

        return boxY + cardHeight;
    }

    drawTableHeader(doc, startY) {
        const columns = [
            { label: 'Subject', x: PAGE.margin + 8, width: 200, align: 'left' },
            { label: 'Obtained', x: PAGE.margin + 214, width: 68, align: 'center' },
            { label: 'Pass', x: PAGE.margin + 286, width: 62, align: 'center' },
            { label: 'Total', x: PAGE.margin + 352, width: 62, align: 'center' },
            { label: 'Grade', x: PAGE.margin + 418, width: 56, align: 'center' },
            { label: 'Status', x: PAGE.margin + 478, width: 36, align: 'center' }
        ];

        doc.roundedRect(PAGE.margin, startY, this.getContentWidth(doc), 28, 6)
            .fill(COLORS.primary);

        doc.fillColor(COLORS.white)
            .font('Helvetica-Bold')
            .fontSize(9);

        columns.forEach((column) => {
            doc.text(column.label, column.x, startY + 9, {
                width: column.width,
                align: column.align
            });
        });

        return startY + 28;
    }

    drawSubjectTable(doc, result, organization, startY) {
        doc.fillColor(COLORS.primary)
            .font('Helvetica-Bold')
            .fontSize(11)
            .text('Subject Wise Marks', PAGE.margin, startY);

        let currentY = this.drawTableHeader(doc, startY + 16);
        const rowHeight = 24;

        result.subjects.forEach((subject, index) => {
            currentY = this.ensureSpace(doc, rowHeight + 24, organization, result, { title: 'Subject Wise Marks' }) || currentY;

            if (doc.y === PAGE.margin + 50) {
                currentY = this.drawTableHeader(doc, doc.y + 10);
            }

            const rowY = currentY;
            const passed = Number(subject.obtainedMarks) >= Number(subject.passMarks);

            doc.rect(PAGE.margin, rowY, this.getContentWidth(doc), rowHeight)
                .fill(index % 2 === 0 ? COLORS.surface : COLORS.white);

            doc.strokeColor(COLORS.border)
                .lineWidth(0.5)
                .moveTo(PAGE.margin, rowY + rowHeight)
                .lineTo(PAGE.margin + this.getContentWidth(doc), rowY + rowHeight)
                .stroke();

            doc.fillColor(COLORS.text)
                .font('Helvetica')
                .fontSize(9)
                .text(subject.subject, PAGE.margin + 8, rowY + 8, { width: 200 })
                .text(formatValue(subject.obtainedMarks), PAGE.margin + 214, rowY + 8, { width: 68, align: 'center' })
                .text(formatValue(subject.passMarks), PAGE.margin + 286, rowY + 8, { width: 62, align: 'center' })
                .text(formatValue(subject.totalMarks), PAGE.margin + 352, rowY + 8, { width: 62, align: 'center' })
                .text(formatValue(subject.grade), PAGE.margin + 418, rowY + 8, { width: 56, align: 'center' });

            doc.fillColor(passed ? COLORS.success : COLORS.danger)
                .font('Helvetica-Bold')
                .text(passed ? 'P' : 'F', PAGE.margin + 478, rowY + 8, {
                    width: 36,
                    align: 'center'
                });

            currentY += rowHeight;
            doc.y = currentY;
        });

        return currentY;
    }

    drawRemarksSection(doc, result, organization, startY) {
        const remarks = result.resultStatus === 'pass'
            ? `The student has successfully passed the ${result.examName || 'exam'} with ${formatValue(result.percentage, '%')} overall marks.`
            : `The student needs improvement in one or more subjects. Please review subject-wise performance for the ${result.examName || 'exam'}.`;

        const sectionY = this.ensureSpace(doc, 84, organization, result, { title: 'Remarks' }) === PAGE.margin + 50
            ? doc.y
            : startY;

        doc.roundedRect(PAGE.margin, sectionY, this.getContentWidth(doc), 62, 8)
            .fillAndStroke(COLORS.surface, COLORS.border);

        doc.fillColor(COLORS.primary)
            .font('Helvetica-Bold')
            .fontSize(11)
            .text('Remarks', PAGE.margin + 16, sectionY + 12);

        doc.fillColor(COLORS.text)
            .font('Helvetica')
            .fontSize(9)
            .text(remarks, PAGE.margin + 16, sectionY + 30, {
                width: this.getContentWidth(doc) - 32
            });

        return sectionY + 62;
    }

    drawSignatureSection(doc, result, organization, startY) {
        const requiredHeight = 72;
        if (startY + requiredHeight > this.getBottomLimit(doc)) {
            doc.addPage();
            this.drawContinuationHeader(doc, organization, result, 'Final Verification');
        }

        const y = doc.y === PAGE.margin + 50
            ? doc.y
            : Math.min(startY, this.getBottomLimit(doc) - requiredHeight);
        const width = this.getContentWidth(doc);

        doc.fillColor(COLORS.muted)
            .font('Helvetica')
            .fontSize(9)
            .text(
                result.isFinalized
                    ? `Finalized on ${formatDate(result.finalizedAt)}. This is a system-generated result statement.`
                    : 'This is a draft system-generated result statement and may be subject to final verification.',
                PAGE.margin,
                y,
                { width: width - 180 }
            );

        doc.moveTo(PAGE.margin + width - 130, y + 26)
            .lineTo(PAGE.margin + width, y + 26)
            .lineWidth(1)
            .strokeColor(COLORS.text)
            .stroke();

        doc.fillColor(COLORS.text)
            .font('Helvetica-Bold')
            .fontSize(10)
            .text('Authorized Signature', PAGE.margin + width - 130, y + 32, {
                width: 130,
                align: 'center'
            });
    }

    drawPageFooters(doc, organization, result) {
        const range = doc.bufferedPageRange();

        for (let pageIndex = 0; pageIndex < range.count; pageIndex += 1) {
            doc.switchToPage(pageIndex);

            const pageNumber = pageIndex + 1;
            const y = doc.page.height - PAGE.margin - 18;
            const width = this.getContentWidth(doc);

            doc.moveTo(PAGE.margin, y - 8)
                .lineTo(PAGE.margin + width, y - 8)
                .lineWidth(0.8)
                .strokeColor(COLORS.border)
                .stroke();

            doc.fillColor(COLORS.muted)
                .font('Helvetica')
                .fontSize(8)
                .text(
                    `${organization?.name || 'School'} | ${result.examName || 'Exam Result'}`,
                    PAGE.margin,
                    y,
                    { width: width / 2 }
                )
                .text(`Page ${pageNumber} of ${range.count}`, PAGE.margin + width - 90, y, {
                    width: 90,
                    align: 'right'
                });
        }
    }
}

export default new ExamResultPdfService();
