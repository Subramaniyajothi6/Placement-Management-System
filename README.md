# 📌 College Placement Management System

A full-stack MERN project for managing the **college placement process**, including:

* Student application tracking
* Interview scheduling
* Company coordination
* Placement drive management
* Reports & analytics

---

## 🚀 Live Demo

* **Frontend (Netlify):** [Placement Management System Frontend](https://placementmanagementsystem-project.netlify.app/admin/dashboard)
* **Backend (Render):** [Placement Management System API](https://placement-management-system-2d32.onrender.com/)

---

## 🔑 Demo Login Credentials

You can use the following demo accounts to explore the system:

* **Admin**
  Email: `admin@gmail.com`
  Password: `123456`

* **Company**
  Email: `company3@gmail.com`
  Password: `123456`

* **Student**
  (Use your own test student account while running locally)

---

## 👨‍💻 Roles & Features

### 🧑‍🎓 Student

* Submit applications with resume & cover letter
* Track application status
* Receive **email notifications** (via Nodemailer) for updates
* View & manage interview schedules

### 🏢 Company

* Choose placement drive & post job openings
* Manage company profile
* View applications received
* Update application status (**triggers email to student**)
* Schedule interviews and update results (**emails sent to student**)

### 👨‍💼 Admin

* Post & manage placement drives
* Manage student lists
* Create new placement drives
* View reports of past drives
* Export reports as **PDF** (using HTML-to-PDF)
* Visualize reports using **Recharts**

---

## ⚙️ Tech Stack

* **Frontend:** React.js, TailwindCSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JWT
* **Email Notifications:** Nodemailer
* **Charts & Reports:** Recharts
* **PDF Export:** html-to-pdf
* **Deployment:**

  * Frontend → Netlify
  * Backend → Render

---

## 🗂️ Project Structure

```
/placement-management-system
  ├── backend   # Express.js API, MongoDB models & controllers
  ├── frontend  # React.js with TailwindCSS
  └── README.md
```

---

## 🛠️ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/placement-management-system.git
cd placement-management-system
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
npm start
```

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4️⃣ Environment Variables

Create a `.env` file in **backend**:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

---

## 📊 Reports & Analytics

* Track number of participants, interviews, offers, and placements
* Visualize placement statistics with charts
* Export results to PDF for official records

---

## ⚠️ Note

* This project is for **educational/demo purposes only**
* Do not use real credentials when testing
* Student account credentials are **kept private**

---

## 📜 License

This project is **open-source** under the MIT License.
