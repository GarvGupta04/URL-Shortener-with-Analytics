# 🔗 URL Shortener with Analytics

A full-stack URL Shortener application that converts long URLs into short, shareable links and tracks link engagement through analytics.

## ✨ Features

- Generate short URLs from long URLs.
- Redirect users to the original destination.
- Track total clicks for each shortened URL.
- View all created URLs in one place.
- Search and delete shortened URLs.
- Dashboard with total URLs, clicks, and average clicks.
- View daily click statistics.
- Analyze individual URL performance.
- Responsive dashboard interface.

## 🛠️ Tech Stack

**Frontend:** React, Vite, Axios, React Router, Recharts, Lucide React

**Backend:** Node.js, Express.js

**Database:** MySQL

## 📁 Project Structure

```text
URL-Shortener/
├── backend/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── package-lock.json
├── .gitignore
└── README.md
```

## ⚙️ Setup and Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd URL-Shortener
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example` and configure your MySQL credentials.

### 3. Database Setup

Create a MySQL database named `url_shortener`.

Run the SQL commands for the `urls` and `url_clicks` tables in MySQL Workbench.

### 4. Start the Backend

```bash
npm run dev
```

Backend runs at:

`http://localhost:5001`

### 5. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## 📊 Analytics

The application provides:

- Overall URL and click statistics.
- Daily click activity.
- Individual URL performance.
- Popular URL insights.

## 🔐 Environment Variables

Configure the backend environment variables in `backend/.env`.

Refer to `backend/.env.example` for the required configuration.

**Never commit your actual `.env` file or database credentials.**
