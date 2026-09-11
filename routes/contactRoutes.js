const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const contactController = require('../controllers/contactController');

// Validation middleware chain
const validateContactForm = [
    check('name')
        .trim()
        .notEmpty().withMessage('Full name is required.')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),
    check('email')
        .trim()
        .notEmpty().withMessage('Email address is required.')
        .isEmail().withMessage('Please provide a valid email address.')
        .normalizeEmail(),
    check('subject')
        .trim()
        .notEmpty().withMessage('Subject is required.')
        .isLength({ min: 3, max: 200 }).withMessage('Subject must be between 3 and 200 characters.'),
    check('message')
        .trim()
        .notEmpty().withMessage('Message is required.')
        .isLength({ min: 10, max: 3000 }).withMessage('Message must be at least 10 characters long.')
];

// Routes
router.post('/', validateContactForm, contactController.submitContactForm);
router.get('/messages', contactController.getAllMessages);

module.exports = router;
