const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const outputDir = path.join(__dirname, '../public/assets/resume');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const certDir = path.join(__dirname, '../public/assets/certificates');
if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'Nitheeshwaran_V_Resume.pdf');
const certOutputPath = path.join(certDir, 'Scion_Internship_Certificate.pdf');

// 1. Generate Nitheeshwaran V. Resume PDF
const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 36, bottom: 36, left: 40, right: 40 }
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Primary Colors
const primaryColor = '#1e3a8a';   // Deep navy blue
const secondaryColor = '#0284c7'; // Sky blue
const darkTextColor = '#1f2937';  // Charcoal body
const mutedColor = '#6b7280';     // Muted gray
const lightBg = '#f8fafc';        // Soft slate background

// Top Header
doc.rect(40, 36, 515, 75).fill(lightBg);

doc.fillColor(primaryColor)
   .font('Helvetica-Bold')
   .fontSize(22)
   .text('NITHEESHWARAN V.', 55, 48);

doc.fillColor(secondaryColor)
   .font('Helvetica-Bold')
   .fontSize(11)
   .text('B.E. COMPUTER SCIENCE & ENGINEERING STUDENT | ASPIRING SOFTWARE DEVELOPER', 55, 74);

doc.fillColor(darkTextColor)
   .font('Helvetica')
   .fontSize(9)
   .text('Email: v.nitheeshwaran35@gmail.com  |  Phone: +91 9150626410  |  Location: Srimushnam, Tamil Nadu - 608703', 55, 92);

let y = 125;

function drawSectionHeader(title, yPos) {
    doc.fillColor(primaryColor)
       .font('Helvetica-Bold')
       .fontSize(12)
       .text(title.toUpperCase(), 40, yPos);
    
    doc.moveTo(40, yPos + 16)
       .lineTo(555, yPos + 16)
       .strokeColor(secondaryColor)
       .lineWidth(1.5)
       .stroke();
    
    return yPos + 24;
}

// CAREER OBJECTIVE
y = drawSectionHeader('Career Objective', y);
doc.fillColor(darkTextColor)
   .font('Helvetica')
   .fontSize(9.5)
   .text(
       'Enthusiastic and detail-oriented 3rd-year Computer Science and Engineering undergraduate seeking opportunities in software engineering and full-stack web development. Eager to leverage hands-on proficiency in Java, Python, Node.js, Express, and MySQL to design high-performance, user-centric software solutions.',
       40,
       y,
       { width: 515, align: 'justify', lineGap: 3 }
   );
y += 44;

// EDUCATION
y = drawSectionHeader('Education', y);

// College
doc.font('Helvetica-Bold').fontSize(10).fillColor(darkTextColor).text('Government College of Engineering, Thanjavur (Sengipatti)', 40, y);
doc.font('Helvetica-Bold').fontSize(9.5).fillColor(primaryColor).text('2024 – 2028', 475, y, { align: 'right' });
y += 14;
doc.font('Helvetica').fontSize(9.5).fillColor(darkTextColor).text('Bachelor of Engineering (B.E.) in Computer Science and Engineering', 40, y);
y += 13;
doc.font('Helvetica-Bold').fontSize(9).fillColor(secondaryColor).text('Academic Standing: CGPA 7.59 (up to 4th Semester)', 40, y);
y += 18;

// School
doc.font('Helvetica-Bold').fontSize(10).fillColor(darkTextColor).text('D.V.C Higher Secondary School, Srimushnam', 40, y);
doc.font('Helvetica-Bold').fontSize(9.5).fillColor(primaryColor).text('Completed 2024', 475, y, { align: 'right' });
y += 14;
doc.font('Helvetica').fontSize(9.5).fillColor(darkTextColor).text('Higher Secondary Certificate (HSC / 12th Grade) - State Board', 40, y);
y += 13;
doc.font('Helvetica-Bold').fontSize(9).fillColor(secondaryColor).text('Score: 80.6%', 40, y);
y += 24;

// TECHNICAL & SOFT SKILLS
y = drawSectionHeader('Skills Matrix', y);

doc.font('Helvetica-Bold').fontSize(9.5).fillColor(primaryColor).text('Programming Languages:', 40, y);
doc.font('Helvetica').fontSize(9.5).fillColor(darkTextColor).text('Python, Java, C, Object-Oriented Programming (OOP)', 180, y);
y += 15;

doc.font('Helvetica-Bold').fontSize(9.5).fillColor(primaryColor).text('Web & Backend:', 40, y);
doc.font('Helvetica').fontSize(9.5).fillColor(darkTextColor).text('HTML5, CSS3, JavaScript, Node.js, Express.js, REST API, MySQL, MySQL2', 180, y);
y += 15;

doc.font('Helvetica-Bold').fontSize(9.5).fillColor(primaryColor).text('Tools & Productivity:', 40, y);
doc.font('Helvetica').fontSize(9.5).fillColor(darkTextColor).text('MS Excel, MS Word, MS PowerPoint, Git, VS Code', 180, y);
y += 15;

doc.font('Helvetica-Bold').fontSize(9.5).fillColor(primaryColor).text('Core Competencies:', 40, y);
doc.font('Helvetica').fontSize(9.5).fillColor(darkTextColor).text('Teamwork, Leadership, Problem Solving, Analytical Thinking, Quick Learner', 180, y);
y += 24;

// INTERNSHIP & PRACTICAL EXPERIENCE
y = drawSectionHeader('Internship Experience', y);

doc.font('Helvetica-Bold').fontSize(10).fillColor(darkTextColor).text('Java Full Stack Web Development Intern', 40, y);
doc.font('Helvetica-Bold').fontSize(9.5).fillColor(primaryColor).text('June 2026 – July 2026', 450, y, { align: 'right' });
y += 14;
doc.font('Helvetica-Bold').fontSize(9.5).fillColor(secondaryColor).text('Scion Research and Development, Thanjavur', 40, y);
y += 14;

const internPoints = [
    'Completed an intensive 1-month professional internship concentrating on Java Full Stack Web Development.',
    'Gained practical industry exposure through hands-on project implementations utilizing Java, JDBC, and relational databases.',
    'Developed modular server-side routines, understood enterprise application architecture, and integrated dynamic user interfaces.'
];
internPoints.forEach(pt => {
    doc.font('Helvetica').fontSize(9).fillColor(darkTextColor).text('•  ' + pt, 50, y, { width: 500, lineGap: 2 });
    y += 15;
});
y += 10;

// KEY PROJECTS
y = drawSectionHeader('Key Technical Projects', y);

// Project 1
doc.font('Helvetica-Bold').fontSize(10).fillColor(darkTextColor).text('Smart College Complaint Management System', 40, y);
doc.font('Helvetica').fontSize(8.5).fillColor(mutedColor).text('[HTML5, CSS3, JavaScript, Node.js, Express.js, MySQL]', 290, y);
y += 14;
const p1Points = [
    'Engineered an end-to-end grievance resolution portal enabling students to log academic and campus issues seamlessly.',
    'Implemented administrative routing and tracking workflows for status updates (Submitted, Under Review, Resolved).',
    'Applied secure parameterized queries in MySQL to ensure data sanitization and prevent injection vulnerabilities.'
];
p1Points.forEach(pt => {
    doc.font('Helvetica').fontSize(9).fillColor(darkTextColor).text('•  ' + pt, 50, y, { width: 500, lineGap: 2 });
    y += 14;
});
y += 5;

// Project 2
doc.font('Helvetica-Bold').fontSize(10).fillColor(darkTextColor).text('Student Academic Performance & CGPA Tracker', 40, y);
doc.font('Helvetica').fontSize(8.5).fillColor(mutedColor).text('[JavaScript, CSS3, Express.js, MySQL]', 290, y);
y += 14;
const p2Points = [
    'Designed an interactive calculation tool conforming to Anna University regulations for SGPA and cumulative CGPA.',
    'Equipped students with semester performance analytics, target grade estimators, and clear tabular breakdowns.'
];
p2Points.forEach(pt => {
    doc.font('Helvetica').fontSize(9).fillColor(darkTextColor).text('•  ' + pt, 50, y, { width: 500, lineGap: 2 });
    y += 14;
});
y += 10;

// EXTRACURRICULAR & CERTIFICATIONS
y = drawSectionHeader('Extracurricular Activities & Certifications', y);

const certs = [
    'Certificate of Completion: Java Full Stack Web Development – Scion Research and Development, Thanjavur.',
    'Active participant in Technical Symposiums, Inter-college Coding Contests, and Web Workshops.',
    'Demonstrated collaborative leadership in organizing departmental student technical forums.'
];
certs.forEach(pt => {
    doc.font('Helvetica').fontSize(9).fillColor(darkTextColor).text('•  ' + pt, 50, y, { width: 500, lineGap: 2 });
    y += 14;
});

doc.end();

stream.on('finish', () => {
    console.log(`\x1b[32m✔ Nitheeshwaran V. Resume PDF successfully generated at: ${outputPath}\x1b[0m`);
    
    // 2. Generate a sample Internship Certificate PDF for the Scion R&D experience
    const certDoc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 40, bottom: 40, left: 40, right: 40 }
    });
    const certStream = fs.createWriteStream(certOutputPath);
    certDoc.pipe(certStream);
    
    // Border
    certDoc.rect(30, 30, 782, 535).lineWidth(4).strokeColor('#1e3a8a').stroke();
    certDoc.rect(36, 36, 770, 523).lineWidth(1.5).strokeColor('#0284c7').stroke();
    
    certDoc.fillColor('#1e3a8a').font('Helvetica-Bold').fontSize(26).text('SCION RESEARCH AND DEVELOPMENT', 40, 70, { align: 'center' });
    certDoc.fillColor('#64748b').font('Helvetica').fontSize(12).text('Thanjavur, Tamil Nadu, India', 40, 105, { align: 'center' });
    
    certDoc.moveDown(1);
    certDoc.fillColor('#0284c7').font('Helvetica-Bold').fontSize(20).text('CERTIFICATE OF INTERNSHIP COMPLETION', 40, 140, { align: 'center' });
    
    certDoc.moveDown(1);
    certDoc.fillColor('#334155').font('Helvetica').fontSize(14).text('This is to certify that', 40, 190, { align: 'center' });
    
    certDoc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(24).text('NITHEESHWARAN V.', 40, 220, { align: 'center' });
    certDoc.fillColor('#475569').font('Helvetica').fontSize(12).text('Student of Government College of Engineering, Thanjavur (Sengipatti)', 40, 255, { align: 'center' });
    
    certDoc.fillColor('#334155').font('Helvetica').fontSize(13).text(
        'has successfully completed a 1-month professional internship in Java Full Stack Web Development from June 2026 to July 2026. During this tenure, he demonstrated commendable proficiency, diligence, and technical expertise in full stack project development.',
        120,
        285,
        { align: 'center', width: 600, lineGap: 4 }
    );
    
    // Signatures
    certDoc.fillColor('#1e3a8a').font('Helvetica-Bold').fontSize(11).text('Date: July 2026', 120, 460);
    certDoc.fillColor('#1e3a8a').font('Helvetica-Bold').fontSize(11).text('Authorized Signatory\nScion Research & Development', 560, 460, { align: 'center' });
    
    certDoc.end();
    certStream.on('finish', () => {
        console.log(`\x1b[32m✔ Scion Internship Certificate PDF generated at: ${certOutputPath}\x1b[0m`);
    });
});
