const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const contactRoutes = require('./routes/contactRoutes');
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');
const { isDbConnected } = require('./database/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);

// Dedicated Secure Resume Download Endpoint
app.get('/api/resume/download', (req, res) => {
    const resumePath = path.join(__dirname, 'public', 'assets', 'resume', 'Nitheeshwaran_V_Resume.pdf');
    
    if (fs.existsSync(resumePath)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="Nitheeshwaran_V_Resume.pdf"');
        return res.download(resumePath, 'Nitheeshwaran_V_Resume.pdf');
    } else {
        return res.status(404).json({
            success: false,
            message: 'Resume PDF is being generated or was not found.'
        });
    }
});

// System Health & Status Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'UP',
        timestamp: new Date().toISOString(),
        database: isDbConnected() ? 'Connected' : 'Offline / Standalone seed mode',
        app: 'Nitheeshwaran V. - Personal Resume & Portfolio'
    });
});

// Single Page Application Fallback for direct URL visits
app.get('*', (req, res, next) => {
    // If request starts with /api, pass to 404 handler
    if (req.originalUrl.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Nitheeshwaran V. Portfolio Server is live!`);
    console.log(`🌐 Local URL: \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
    console.log(`📡 Health:    \x1b[36mhttp://localhost:${PORT}/api/health\x1b[0m`);
    console.log(`📄 Resume:    \x1b[36mhttp://localhost:${PORT}/api/resume/download\x1b[0m`);
    console.log(`======================================================\n`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\x1b[31m[Port Conflict] Port ${PORT} is already in use by another running process.\x1b[0m`);
        console.log(`\x1b[33mTo fix this, either stop the existing process or change PORT in .env (e.g. PORT=5001).\x1b[0m`);
    } else {
        console.error('[Server Error]', err);
    }
});

