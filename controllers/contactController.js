const { validationResult } = require('express-validator');
const db = require('../database/db');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

/**
 * Helper to escape HTML characters for secure email rendering
 */
const escapeHtml = (text) => {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

/**
 * Configure Nodemailer Transporter with Gmail SMTP
 * Uses 16-character Gmail App Password from EMAIL_PASS / EMAIL_USER
 */
const getTransporter = () => {
    const user = process.env.EMAIL_USER || process.env.SMTP_USER;
    const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

    if (!user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: pass
        }
    });
};

/**
 * Handle contact form submission
 * Flow:
 * 1. Validate fields
 * 2. Save into MySQL (contact_messages) with parameterized query
 * 3. Send email notification via Nodemailer Gmail SMTP
 * 4. Return JSON response
 * POST /api/contact
 */
exports.submitContactForm = async (req, res, next) => {
    try {
        // 1. Check validation results from express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Please check your inputs and try again.',
                errors: errors.array().map(e => ({ field: e.path, msg: e.msg }))
            });
        }

        const { name, email, subject, message } = req.body;

        // Clean and sanitize input values
        const cleanName = String(name || '').trim();
        const cleanEmail = String(email || '').trim().toLowerCase();
        const cleanSubject = String(subject || '').trim();
        const cleanMessage = String(message || '').trim();
        const receivedAt = new Date().toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'medium'
        });

        let savedToDatabase = false;
        let insertedId = null;

        // 2. Save into MySQL using Parameterized Queries (prevents SQL injection)
        try {
            const sql = 'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)';
            const [result] = await db.query(sql, [cleanName, cleanEmail, cleanSubject, cleanMessage]);
            savedToDatabase = true;
            insertedId = result.insertId;
            console.log(`\x1b[32m✔ [Contact DB] Message from "${cleanName}" saved to MySQL with ID: ${insertedId}\x1b[0m`);
        } catch (dbError) {
            console.warn(`[Contact DB Warning] Could not save to MySQL: ${dbError.message}`);

            // Backup storage to local JSON file so no user messages are ever lost
            try {
                const backupPath = path.join(__dirname, '../database/contact_backup.json');
                let existing = [];
                if (fs.existsSync(backupPath)) {
                    try {
                        existing = JSON.parse(fs.readFileSync(backupPath, 'utf8') || '[]');
                    } catch (parseErr) {
                        existing = [];
                    }
                }
                existing.push({
                    name: cleanName,
                    email: cleanEmail,
                    subject: cleanSubject,
                    message: cleanMessage,
                    createdAt: new Date().toISOString()
                });
                fs.writeFileSync(backupPath, JSON.stringify(existing, null, 2));
                savedToDatabase = true;
                console.log(`✔ [Contact Backup] Saved message to backup storage: ${backupPath}`);
            } catch (fsErr) {
                console.error('[Contact Backup Error]', fsErr.message);
            }
        }

        // 3. Send Email Notification using Nodemailer (Gmail SMTP)
        const recipientEmail = process.env.EMAIL_USER || process.env.CONTACT_RECEIVER_EMAIL || 'v.nitheeshwaran35@gmail.com';
        const senderUser = process.env.EMAIL_USER || process.env.SMTP_USER;
        const senderPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

        const isAppPasswordPlaceholder = !senderPass || senderPass === 'YOUR_GMAIL_APP_PASSWORD' || senderPass === 'your-gmail-app-password';

        if (isAppPasswordPlaceholder) {
            const configNotice = '[Nodemailer Config] EMAIL_PASS in .env is not yet configured with a valid 16-character Gmail App Password.';
            console.warn(`\x1b[33m${configNotice}\x1b[0m`);
            console.warn(`\x1b[33m[Contact Notice] Message was saved to database (ID: ${insertedId || 'backup'}), but email delivery was skipped because EMAIL_PASS needs your Gmail App Password.\x1b[0m`);

            return res.status(500).json({
                success: false,
                message: 'Unable to send your message right now. Please try again later.',
                error: 'EMAIL_NOT_CONFIGURED'
            });
        }

        const transporter = getTransporter();
        if (!transporter) {
            console.error('[Nodemailer Error] Could not initialize Nodemailer Gmail transporter. Verify EMAIL_USER and EMAIL_PASS.');
            return res.status(500).json({
                success: false,
                message: 'Unable to send your message right now. Please try again later.'
            });
        }

        // Formatted plain text body
        const textBody = [
            'New message from your portfolio website',
            '',
            `Name: ${cleanName}`,
            `Email: ${cleanEmail}`,
            `Subject: ${cleanSubject}`,
            '',
            'Message:',
            cleanMessage,
            '',
            `Received at:`,
            receivedAt
        ].join('\n');

        // Clean and professional HTML email template
        const htmlBody = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    line-height: 1.6;
                    color: #1e293b;
                    background-color: #f8fafc;
                    margin: 0;
                    padding: 20px;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
                }
                .email-header {
                    background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
                    color: #ffffff;
                    padding: 28px 24px;
                    text-align: left;
                }
                .email-header h2 {
                    margin: 0 0 6px;
                    font-size: 20px;
                    font-weight: 700;
                    color: #ffffff;
                }
                .email-header p {
                    margin: 0;
                    opacity: 0.92;
                    font-size: 14px;
                }
                .email-body {
                    padding: 28px 24px;
                }
                .field-row {
                    margin-bottom: 18px;
                }
                .field-label {
                    font-size: 12px;
                    text-transform: uppercase;
                    color: #64748b;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    margin-bottom: 4px;
                }
                .field-value {
                    font-size: 15px;
                    color: #0f172a;
                    font-weight: 500;
                }
                .message-box {
                    background: #f1f5f9;
                    border-left: 4px solid #2563eb;
                    padding: 16px;
                    border-radius: 6px;
                    font-size: 15px;
                    color: #1e293b;
                    white-space: pre-wrap;
                    word-break: break-word;
                    line-height: 1.6;
                    margin-top: 6px;
                }
                .action-row {
                    margin-top: 24px;
                    padding-top: 20px;
                    border-top: 1px solid #e2e8f0;
                    text-align: center;
                }
                .btn-reply {
                    display: inline-block;
                    background: #2563eb;
                    color: #ffffff !important;
                    text-decoration: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 14px;
                }
                .email-footer {
                    background: #f8fafc;
                    border-top: 1px solid #e2e8f0;
                    padding: 16px 24px;
                    font-size: 12px;
                    color: #64748b;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h2>New message from your portfolio website</h2>
                    <p>A visitor has submitted a new inquiry via your Contact Me form.</p>
                </div>
                <div class="email-body">
                    <div class="field-row">
                        <div class="field-label">Name:</div>
                        <div class="field-value">${escapeHtml(cleanName)}</div>
                    </div>
                    <div class="field-row">
                        <div class="field-label">Email:</div>
                        <div class="field-value">
                            <a href="mailto:${cleanEmail}" style="color:#2563eb; text-decoration:underline;">${escapeHtml(cleanEmail)}</a>
                        </div>
                    </div>
                    <div class="field-row">
                        <div class="field-label">Subject:</div>
                        <div class="field-value">${escapeHtml(cleanSubject)}</div>
                    </div>
                    <div class="field-row">
                        <div class="field-label">Message:</div>
                        <div class="message-box">${escapeHtml(cleanMessage)}</div>
                    </div>
                    <div class="field-row">
                        <div class="field-label">Received at:</div>
                        <div class="field-value">${receivedAt}</div>
                    </div>
                    <div class="action-row">
                        <a href="mailto:${cleanEmail}?subject=Re: ${encodeURIComponent(cleanSubject)}" class="btn-reply">
                            Reply Directly to ${escapeHtml(cleanName)}
                        </a>
                    </div>
                </div>
                <div class="email-footer">
                    Sent securely from Nitheeshwaran V. Portfolio Website &bull; Government College of Engineering, Thanjavur
                </div>
            </div>
        </body>
        </html>
        `;

        try {
            await transporter.sendMail({
                from: `"Portfolio Contact Form" <${senderUser}>`,
                to: recipientEmail,
                replyTo: cleanEmail,
                subject: `New Portfolio Contact: ${cleanSubject}`,
                text: textBody,
                html: htmlBody
            });

            console.log(`\x1b[32m✔ [Nodemailer] Successfully sent notification email to ${recipientEmail} for inquiry "${cleanSubject}"\x1b[0m`);
        } catch (mailErr) {
            console.error('[Nodemailer Error] Email delivery failed:', mailErr);
            console.log(`[Contact Notice] Message ID ${insertedId || 'backup'} was saved, but email failed.`);

            return res.status(500).json({
                success: false,
                message: 'Unable to send your message right now. Please try again later.'
            });
        }

        // 4. Success response
        return res.status(200).json({
            success: true,
            message: 'Message sent successfully!',
            data: {
                id: insertedId,
                name: cleanName,
                email: cleanEmail,
                subject: cleanSubject
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get all contact messages (Admin/developer utility)
 * GET /api/contact/messages
 */
exports.getAllMessages = async (req, res, next) => {
    try {
        const sql = 'SELECT id, name, email, subject, message, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 50';
        const [rows] = await db.query(sql);
        return res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
        // Fallback to backup if DB is disconnected
        const backupPath = path.join(__dirname, '../database/contact_backup.json');
        if (fs.existsSync(backupPath)) {
            try {
                const data = JSON.parse(fs.readFileSync(backupPath, 'utf8') || '[]');
                return res.json({ success: true, count: data.length, data, source: 'backup' });
            } catch (pErr) {
                return res.status(500).json({ success: false, message: 'Database currently offline' });
            }
        }
        return res.status(500).json({ success: false, message: 'Database currently offline' });
    }
};
