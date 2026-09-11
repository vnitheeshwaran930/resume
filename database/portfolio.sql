-- ==========================================================
-- Database Schema for Nitheeshwaran V. - Portfolio Website
-- Database: portfolio_db
-- ==========================================================

CREATE DATABASE IF NOT EXISTS portfolio_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE portfolio_db;

-- ----------------------------------------------------------
-- 1. Table structure for contact_messages
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------
-- 2. Table structure for projects
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Web Development',
    description TEXT NOT NULL,
    technologies VARCHAR(255) NOT NULL,
    github_url VARCHAR(255) DEFAULT '#',
    demo_url VARCHAR(255) DEFAULT '#',
    image_url VARCHAR(255) DEFAULT '',
    featured BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------
-- 3. Table structure for skills
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category ENUM('Programming', 'Web Development', 'Tools', 'Soft Skills') NOT NULL,
    proficiency INT NOT NULL DEFAULT 85,
    icon_class VARCHAR(100) NOT NULL,
    display_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------
-- Seed Data for Projects
-- ----------------------------------------------------------
INSERT INTO projects (title, category, description, technologies, github_url, demo_url, image_url, featured)
VALUES
(
    'Smart College Complaint Management System',
    'Full Stack',
    'A robust web-based application enabling college students to submit grievances and department heads/administrators to assign, monitor, resolve, and audit complaint tickets in real time.',
    'HTML5, CSS3, JavaScript, Node.js, Express.js, MySQL',
    'https://github.com/nitheeshwaran35/smart-college-complaint-system',
    '#',
    'assets/images/project-complaint.svg',
    TRUE
),
(
    'Student Academic Performance & CGPA Tracker',
    'Web Application',
    'An interactive academic evaluation tool designed for engineering students to compute semester-wise GPA/CGPA, forecast target grades, and visualize academic trends over semesters.',
    'JavaScript, Bootstrap 5, Express.js, MySQL',
    'https://github.com/nitheeshwaran35/cgpa-academic-tracker',
    '#',
    'assets/images/project-cgpa.svg',
    TRUE
),
(
    'Dynamic Portfolio & Resume Builder Web App',
    'Web Development',
    'A modern responsive portfolio with an integrated contact dispatch API, resume PDF exporter, dynamic skill visualization, and dark/light mode system.',
    'HTML5, CSS3, Vanilla JS, Node.js, Express, REST API',
    'https://github.com/nitheeshwaran35/personal-portfolio',
    '#',
    'assets/images/project-portfolio.svg',
    TRUE
),
(
    'Java Full Stack Library Management System',
    'Java Full Stack',
    'A complete digital library cataloging system handling book lending, return penalty tracking, student membership records, and real-time inventory queries.',
    'Java, OOP, JDBC, MySQL, HTML5, CSS3',
    'https://github.com/nitheeshwaran35/java-library-management',
    '#',
    'assets/images/project-library.svg',
    FALSE
)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- ----------------------------------------------------------
-- Seed Data for Skills
-- ----------------------------------------------------------
INSERT INTO skills (name, category, proficiency, icon_class, display_order)
VALUES
-- Programming
('Python', 'Programming', 85, 'fa-brands fa-python', 1),
('Java', 'Programming', 90, 'fa-brands fa-java', 2),
('C', 'Programming', 80, 'fa-solid fa-code', 3),
('OOP (Object-Oriented Programming)', 'Programming', 88, 'fa-solid fa-cubes', 4),

-- Web Development
('HTML5', 'Web Development', 95, 'fa-brands fa-html5', 5),
('CSS3', 'Web Development', 90, 'fa-brands fa-css3-alt', 6),
('JavaScript', 'Web Development', 88, 'fa-brands fa-js', 7),
('Node.js', 'Web Development', 84, 'fa-brands fa-node-js', 8),
('Express.js', 'Web Development', 82, 'fa-solid fa-server', 9),
('MySQL', 'Web Development', 86, 'fa-solid fa-database', 10),

-- Tools & Productivity
('MS Excel', 'Tools', 85, 'fa-solid fa-file-excel', 11),
('MS Word', 'Tools', 90, 'fa-solid fa-file-word', 12),
('MS PowerPoint', 'Tools', 88, 'fa-solid fa-file-powerpoint', 13),

-- Soft Skills
('Teamwork', 'Soft Skills', 95, 'fa-solid fa-people-group', 14),
('Leadership', 'Soft Skills', 88, 'fa-solid fa-user-tie', 15),
('Problem Solving', 'Soft Skills', 92, 'fa-solid fa-brain', 16)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ----------------------------------------------------------
-- Sample Contact Message for Verification
-- ----------------------------------------------------------
INSERT INTO contact_messages (name, email, subject, message)
VALUES
('HR Recruiter', 'recruiter@techsolutions.com', 'Internship Opportunity for Software Developer', 'Hello Nitheeshwaran, we reviewed your profile and projects and would love to discuss an internship opportunity.')
ON DUPLICATE KEY UPDATE name=VALUES(name);
