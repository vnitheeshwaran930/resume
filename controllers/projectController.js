const db = require('../database/db');

// Seed projects fallback for instant display even when MySQL server is not started yet
const seedProjects = [
    {
        id: 1,
        title: 'Smart College Complaint Management System',
        category: 'Full Stack',
        description: 'A comprehensive web-based platform allowing students to submit grievances and campus authorities to categorize, prioritize, assign, and track resolution progress in real-time.',
        technologies: 'HTML5, CSS3, JavaScript, Node.js, Express.js, MySQL',
        github_url: 'https://github.com/nitheeshwaran35/smart-college-complaint-system',
        demo_url: '#',
        image_url: 'assets/images/project-complaint.svg',
        featured: 1,
        highlights: [
            'Role-based dashboard for students and campus admins',
            'Automated ticket status workflow (Pending, In Progress, Resolved)',
            'Secure MySQL parameterized operations for grievance records'
        ]
    },
    {
        id: 2,
        title: 'Student Academic Performance & CGPA Tracker',
        category: 'Web Application',
        description: 'An interactive engineering grade calculator and semester analysis tool enabling students to calculate semester SGPA, cumulative CGPA, and visualize performance trends.',
        technologies: 'JavaScript, CSS3, Express.js, MySQL',
        github_url: 'https://github.com/nitheeshwaran35/cgpa-academic-tracker',
        demo_url: '#',
        image_url: 'assets/images/project-cgpa.svg',
        featured: 1,
        highlights: [
            'Dynamic credit-point calculation matching Anna University curriculum',
            'Visual grade distribution and trend prediction',
            'Exportable academic summary reports'
        ]
    },
    {
        id: 3,
        title: 'Interactive Developer Portfolio & Resume Platform',
        category: 'Web Development',
        description: 'A responsive full-stack portfolio website featuring dynamic theme toggling, RESTful endpoints, database inquiry logging, and direct PDF resume generation.',
        technologies: 'HTML5, CSS3, JavaScript, Node.js, Express.js, MySQL',
        github_url: 'https://github.com/nitheeshwaran35/personal-portfolio',
        demo_url: '#',
        image_url: 'assets/images/project-portfolio.svg',
        featured: 1,
        highlights: [
            'Smooth responsive CSS without heavy JS frameworks',
            'REST API with express-validator and prepared statements',
            'Instant AJAX contact feedback without page refreshes'
        ]
    },
    {
        id: 4,
        title: 'Java Full Stack Library Management System',
        category: 'Java Full Stack',
        description: 'A full-scale library cataloging application developed during internship training at Scion R&D, implementing book reservation, fine computation, and user management.',
        technologies: 'Java, OOP, JDBC, MySQL, HTML5, CSS3',
        github_url: 'https://github.com/nitheeshwaran35/java-library-management',
        demo_url: '#',
        image_url: 'assets/images/project-library.svg',
        featured: 0,
        highlights: [
            'Object-Oriented design patterns & robust relational schema',
            'Automated fine calculation based on issue deadlines',
            'Real-time book availability search filter'
        ]
    }
];

/**
 * Get all projects
 * GET /api/projects
 */
exports.getProjects = async (req, res, next) => {
    try {
        const sql = 'SELECT * FROM projects ORDER BY featured DESC, id ASC';
        const [rows] = await db.query(sql);

        if (rows && rows.length > 0) {
            return res.json({
                success: true,
                count: rows.length,
                source: 'database',
                data: rows
            });
        }

        // Return seed if table is empty
        return res.json({
            success: true,
            count: seedProjects.length,
            source: 'seed',
            data: seedProjects
        });
    } catch (err) {
        // Safe fallback if MySQL is offline
        return res.json({
            success: true,
            count: seedProjects.length,
            source: 'fallback',
            data: seedProjects
        });
    }
};

/**
 * Get single project by ID
 * GET /api/projects/:id
 */
exports.getProjectById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const sql = 'SELECT * FROM projects WHERE id = ?';
        const [rows] = await db.query(sql, [id]);

        if (rows && rows.length > 0) {
            return res.json({ success: true, data: rows[0] });
        }

        const fallback = seedProjects.find(p => p.id === id);
        if (fallback) {
            return res.json({ success: true, data: fallback });
        }

        return res.status(404).json({ success: false, message: 'Project not found' });
    } catch (err) {
        const fallback = seedProjects.find(p => p.id === parseInt(req.params.id, 10));
        if (fallback) {
            return res.json({ success: true, data: fallback });
        }
        return res.status(404).json({ success: false, message: 'Project not found' });
    }
};
