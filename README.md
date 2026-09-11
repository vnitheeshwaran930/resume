# Nitheeshwaran V. - Personal Resume & Portfolio Website

A modern, professional, fully-responsive full-stack Developer Resume and Portfolio website built for **Nitheeshwaran V.** (3rd Year B.E. Computer Science and Engineering Student at Government College of Engineering, Thanjavur).

Built using **HTML5, CSS3, Vanilla JavaScript, Node.js, Express.js, and MySQL** without heavy frontend frameworks (no React, Angular, or Next.js), adhering to clean modular architecture, security best practices, and high aesthetic standards.

---

## 🚀 Live Features

1. **Modern Dark / Light Theme**:
   - Toggle between sleek midnight dark mode and crisp high-contrast light mode with preference saved in `localStorage`.
2. **Hero & Interactive Typography**:
   - Dynamic typewriter effect highlighting roles ("Aspiring Software Developer", "Full Stack Web Enthusiast", etc.).
   - Direct CTA buttons: *View My Projects*, *Download Resume*, and *Contact Me*.
3. **Structured Portfolio Sections**:
   - **About Me**: Career objective, academic summary (7.59 CGPA, 2028 graduation), and core technical interests.
   - **Education**: Vertical milestones timeline covering B.E. CSE at GCE Thanjavur (CGPA: 7.59) and HSC at D.V.C Higher Secondary School (80.6%).
   - **Skills Matrix**: Categorized filter tabs (Programming, Web Development, Tools, Soft Skills) with animated progress bars on scroll.
   - **Internship / Experience**: Java Full Stack Web Development Intern at Scion Research and Development, Thanjavur (June – July 2026) with an interactive modal to view the verified certificate PDF.
   - **Featured Projects**: Showcase cards for *Smart College Complaint Management System*, *Student Academic Performance & CGPA Tracker*, *Portfolio Platform*, and *Java Full Stack Library System* with GitHub and live demo links.
   - **Extracurriculars & Certifications**: Symposiums, student leadership, and credentials.
4. **Interactive Contact Form & Express REST API**:
   - Asynchronous `fetch()` submission without page reloads.
   - Input validation and sanitization using `express-validator`.
   - Parameterized MySQL queries (`?` placeholders) to eliminate SQL injection risks.
   - Instant visual toast notifications for success and validation errors.
   - Optional email forwarding via `nodemailer` if configured.
5. **Resume & Certificate PDF Download**:
   - Genuine downloadable PDF resume automatically generated at `public/assets/resume/Nitheeshwaran_V_Resume.pdf`.
   - Scion R&D Internship Certificate generated at `public/assets/certificates/Scion_Internship_Certificate.pdf`.
6. **Accessible & Responsive**:
   - Fully optimized for mobile, tablet, laptop, and ultra-wide screens.
   - Slide-in hamburger navigation for smaller viewports.
   - Floating scroll-to-top button.

---

## 📁 Project Directory Structure

```text
d:\Project\resume\
├── server.js                          # Express app entrypoint & static file serving
├── package.json                       # Scripts and project dependencies
├── .env                               # Local environment variables (git-ignored)
├── .env.example                       # Configuration template
├── .gitignore                         # Git exclusion rules
├── README.md                          # Complete documentation & setup instructions
│
├── routes/
│   ├── contactRoutes.js               # POST /api/contact with express-validator
│   ├── projectRoutes.js               # GET /api/projects & GET /api/projects/:id
│   └── skillRoutes.js                 # GET /api/skills
│
├── controllers/
│   ├── contactController.js           # Sanitization, prepared MySQL insert, email dispatch
│   ├── projectController.js           # Project queries with fallback seed
│   └── skillController.js             # Skill queries grouped by category
│
├── database/
│   ├── db.js                          # MySQL2 connection pool with error handling
│   └── portfolio.sql                  # Database schema (portfolio_db) & initial seed data
│
├── middleware/
│   └── errorHandler.js                # Global 404 and 500 error handlers
│
├── scripts/
│   └── generateResume.js              # Script to build PDF resume & certificate
│
└── public/
    ├── index.html                     # Semantic, accessible HTML5 single-page portfolio
    │
    ├── css/
    │   └── style.css                  # Custom responsive CSS design system
    │
    ├── js/
    │   └── script.js                  # Theme switcher, scrollspy, dynamic typewriter, AJAX form
    │
    └── assets/
        ├── images/                    # Profile avatar, project previews, logo, favicon
        ├── certificates/              # Scion_Internship_Certificate.pdf
        └── resume/
            └── Nitheeshwaran_V_Resume.pdf
```

---

## 🛠 Prerequisites

Make sure you have the following installed on your computer:
1. **Node.js** (v16.x or higher) and **npm**: [Download Node.js](https://nodejs.org/)
2. **XAMPP** (or standalone MySQL Server): [Download XAMPP](https://www.apachefriends.org/)

---

## ⚙️ Installation & Setup

### Step 1: Install Dependencies
Open a terminal (PowerShell or Command Prompt) in the project directory `d:\Project\resume` and run:

```bash
npm install
```

### Step 2: Configure Environment Variables
Copy the `.env.example` file to create your `.env` file (or edit the existing `.env`):

```bash
# On Windows PowerShell
Copy-Item .env.example .env
```

Ensure your `.env` matches your MySQL settings:

```env
PORT=5000
NODE_ENV=development

# MySQL Database Settings
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=portfolio_db
DB_PORT=3306

# Optional: Nodemailer Email Settings (Leave blank if you don't need email dispatch)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
CONTACT_RECEIVER_EMAIL=v.nitheeshwaran35@gmail.com
```

---

## 🗄️ MySQL Database Setup (via XAMPP or Command Line)

### Option A: Using phpMyAdmin in XAMPP (Recommended)
1. Open the **XAMPP Control Panel**.
2. Click **Start** next to **Apache** and **MySQL**.
3. Open your browser and navigate to: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
4. Click on the **Import** tab at the top.
5. Click **Choose File** and select:
   `d:\Project\resume\database\portfolio.sql`
6. Scroll down and click **Import** (or **Go**).
7. The database `portfolio_db` and tables (`contact_messages`, `projects`, `skills`) will be automatically created and populated with sample data!

### Option B: Using MySQL Command Line
Run the following in your terminal:

```bash
mysql -u root -p < database/portfolio.sql
```

*(If prompted for a password and you are on default XAMPP, just press Enter).*

> **Note:** Even if MySQL is not running immediately, the server includes resilient fallback handling: skills and projects will load seamlessly on the website, and messages will be safely stored in `database/contact_backup.json` until MySQL is launched!

---

## 🚀 Running the Project

### Start the Express Server:
```bash
npm start
```

For automatic server reload during development (using nodemon):
```bash
npm run dev
```

### Access in Browser:
- **Portfolio Website:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Direct Resume Download:** [http://localhost:5000/api/resume/download](http://localhost:5000/api/resume/download)

---

## 📡 REST API Documentation

### 1. Submit Contact Message
- **Endpoint:** `POST /api/contact`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "name": "Alex Johnson",
  "email": "alex@example.com",
  "subject": "Internship Opportunity",
  "message": "Hello Nitheeshwaran, we would love to connect with you regarding a software engineering role."
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Thank you for reaching out, Nitheeshwaran has received your message and will respond promptly!",
  "data": {
    "id": 1,
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "subject": "Internship Opportunity"
  }
}
```
- **Validation Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Please check your inputs and try again.",
  "errors": [
    { "field": "email", "msg": "Please provide a valid email address." }
  ]
}
```

### 2. Fetch Projects
- **Endpoint:** `GET /api/projects`
- **Response:** Returns list of all portfolio projects from MySQL or fallback seed.

### 3. Fetch Skills
- **Endpoint:** `GET /api/skills`
- **Response:** Returns skills categorized by `Programming`, `Web Development`, `Tools`, and `Soft Skills`.

### 4. Download Resume PDF
- **Endpoint:** `GET /api/resume/download`
- **Response:** Initiates secure attachment download of `Nitheeshwaran_V_Resume.pdf`.

---

## 🔒 Security Best Practices Implemented

1. **SQL Injection Prevention:**
   All queries to MySQL use `mysql2/promise` parameterized statements (`?` placeholders). No user input is directly concatenated into SQL.
2. **Input Validation & Sanitization:**
   `express-validator` validates email structure, input lengths, and trims whitespace to prevent malformed or malicious payloads.
3. **Environment Isolation:**
   Database credentials and email authentication keys reside strictly in `.env`, which is included in `.gitignore`.
4. **Information Leak Protection:**
   The global error handling middleware masks internal database exceptions and stack traces in production mode.

---

## 👤 Personal Information Summary

- **Name:** Nitheeshwaran V.
- **Role:** 3rd Year B.E. Computer Science and Engineering Student
- **College:** Government College of Engineering, Thanjavur (Sengipatti)
- **Graduation:** 2028
- **CGPA:** 7.59 (up to 4th semester)
- **12th Grade:** D.V.C Higher Secondary School, Srimushnam – 80.6%
- **Location:** L.A.T Nagar, Srimushnam, Tamil Nadu – 608703
- **Email:** [v.nitheeshwaran35@gmail.com](mailto:v.nitheeshwaran35@gmail.com)
- **Phone:** +91 9150626410
- **GitHub:** [https://github.com/nitheeshwaran35](https://github.com/nitheeshwaran35)

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
