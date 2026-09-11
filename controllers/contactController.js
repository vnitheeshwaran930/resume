const { validationResult } = require('express-validator');
const db = require('../database/db');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Optional transporter initialization
let transporter = null;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
        transporter = nodemailer.createTransporter({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT, 10) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    } catch (err) {
        console.warn('Nodemailer configuration error:', err.message);
    }
}

/**
 * Handle contact form submission
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

        // Clean & sanitize input values
        const cleanName = String(name || '').trim();
        const cleanEmail = String(email || '').trim().toLowerCase();
        const cleanSubject = String(subject || '').trim();
        const cleanMessage = String(message || '').trim();

        let savedToDatabase = false;
        let insertedId = null;

        // 2. Insert into MySQL using Parameterized Queries (prevents SQL injection)
        try {
            const sql = 'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)';
            const [result] = await db.query(sql, [cleanName, cleanEmail, cleanSubject, cleanMessage]);
            savedToDatabase = true;
            insertedId = result.insertId;
        } catch (dbError) {
            console.warn(`[Contact DB Warning] Could not save to MySQL: ${dbError.message}`);
            
            // Backup storage to local JSON file so no user messages are ever lost
            try {
                const backupPath = path.join(__dirname, '../database/contact_backup.json');
                let existing = [];
                if (fs.existsSync(backupPath)) {
                    existing = JSON.parse(fs.readFileSync(backupPath, 'utf8') || '[]');
                }
                existing.push({
                    name: cleanName,
                    email: cleanEmail,
                    subject: cleanSubject,
                    message: cleanMessage,
                    createdAt: new Date().toISOString()
                });
                fs.writeFileSync(backupPath, JSON.stringify(existing, null, 2));
                savedToDatabase = true; // Recorded in backup
            } catch (fsErr) {
                console.error('[Backup Error]', fsErr.message);
            }
        }

        // 3. Optional: Send Email Notification via Nodemailer
        if (transporter && process.env.CONTACT_RECEIVER_EMAIL) {
            try {
                await transporter.sendMail({
                    from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
                    to: process.env.CONTACT_RECEIVER_EMAIL,
                    replyTo: cleanEmail,
                    subject: `[Portfolio Inquiry] ${cleanSubject}`,
                    html: `
                        <h3>New Contact Message Received</h3>
                        <p><strong>Name:</strong> ${cleanName}</p>
                        <p><strong>Email:</strong> ${cleanEmail}</p>
                        <p><strong>Subject:</strong> ${cleanSubject}</p>
                        <p><strong>Message:</strong></p>
                        <p style="background:#f4f4f4; padding:12px; border-radius:6px;">${cleanMessage.replace(/\n/g, '<br>')}</p>
                        <hr/>
                        <p><small>Sent from Nitheeshwaran V. Portfolio Website</small></p>
                    `
                });
            } catch (mailErr) {
                console.warn('[Nodemailer Notice] Could not send email notification:', mailErr.message);
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Thank you for reaching out, Nitheeshwaran has received your message and will respond promptly!',
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
            const data = JSON.parse(fs.readFileSync(backupPath, 'utf8') || '[]');
            return res.json({ success: true, count: data.length, data, source: 'backup' });
        }
        return res.status(500).json({ success: false, message: 'Database currently offline' });
    }
};
