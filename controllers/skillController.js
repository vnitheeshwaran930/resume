const db = require('../database/db');

// Seed skills fallback organized cleanly by category
const seedSkills = [
    // Programming
    { id: 1, name: 'Python', category: 'Programming', proficiency: 85, icon_class: 'fa-brands fa-python' },
    { id: 2, name: 'Java', category: 'Programming', proficiency: 90, icon_class: 'fa-brands fa-java' },
    { id: 3, name: 'C', category: 'Programming', proficiency: 80, icon_class: 'fa-solid fa-code' },
    { id: 4, name: 'OOP', category: 'Programming', proficiency: 88, icon_class: 'fa-solid fa-cubes' },

    // Web Development
    { id: 5, name: 'HTML5', category: 'Web Development', proficiency: 95, icon_class: 'fa-brands fa-html5' },
    { id: 6, name: 'CSS3', category: 'Web Development', proficiency: 90, icon_class: 'fa-brands fa-css3-alt' },
    { id: 7, name: 'JavaScript', category: 'Web Development', proficiency: 88, icon_class: 'fa-brands fa-js' },
    { id: 8, name: 'Node.js', category: 'Web Development', proficiency: 84, icon_class: 'fa-brands fa-node-js' },
    { id: 9, name: 'Express.js', category: 'Web Development', proficiency: 82, icon_class: 'fa-solid fa-server' },
    { id: 10, name: 'MySQL', category: 'Web Development', proficiency: 86, icon_class: 'fa-solid fa-database' },

    // Tools
    { id: 11, name: 'MS Excel', category: 'Tools', proficiency: 85, icon_class: 'fa-solid fa-file-excel' },
    { id: 12, name: 'MS Word', category: 'Tools', proficiency: 90, icon_class: 'fa-solid fa-file-word' },
    { id: 13, name: 'MS PowerPoint', category: 'Tools', proficiency: 88, icon_class: 'fa-solid fa-file-powerpoint' },

    // Soft Skills
    { id: 14, name: 'Teamwork', category: 'Soft Skills', proficiency: 95, icon_class: 'fa-solid fa-people-group' },
    { id: 15, name: 'Leadership', category: 'Soft Skills', proficiency: 88, icon_class: 'fa-solid fa-user-tie' },
    { id: 16, name: 'Problem Solving', category: 'Soft Skills', proficiency: 92, icon_class: 'fa-solid fa-brain' }
];

/**
 * Helper to group skills by category
 */
const groupSkills = (skillsList) => {
    return skillsList.reduce((acc, skill) => {
        const cat = skill.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
    }, {});
};

/**
 * Get all skills
 * GET /api/skills
 */
exports.getSkills = async (req, res, next) => {
    try {
        const sql = 'SELECT * FROM skills ORDER BY display_order ASC, id ASC';
        const [rows] = await db.query(sql);

        const list = (rows && rows.length > 0) ? rows : seedSkills;
        const grouped = groupSkills(list);

        return res.json({
            success: true,
            count: list.length,
            categories: grouped,
            data: list
        });
    } catch (err) {
        return res.json({
            success: true,
            count: seedSkills.length,
            categories: groupSkills(seedSkills),
            data: seedSkills,
            source: 'fallback'
        });
    }
};
