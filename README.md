# 🐾 PawFinder - Dog Adoption & Rescue Platform

**PawFinder** is a modern, full-stack web and desktop application connecting dog lovers with rescue shelters, adoption listings, foster programs, and volunteer opportunities.

---

## ✨ Key Features

- 🐶 **Dog Adoption Listings**: Browse detailed profiles with filtering by breed, age, size, and location.
- 🏠 **Shelter Management**: Portal for rescue shelters to manage applications, list dogs, and communicate with adopters.
- 📋 **Adoption & Foster Applications**: Interactive multi-step adoption and foster application process.
- 🤝 **Volunteer Network**: Sign up for shelter volunteering and event participation.
- 💬 **Live Chat & Messaging**: Direct communication between adopters and shelter staff.
- 📚 **Pet Care Articles**: Resources and care guides for new pet owners.
- 🖥️ **Cross-Platform**: Run as a web app or as a native desktop application via Electron.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, Session Authentication
- **Database**: SQLite (`better-sqlite3`)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Desktop Packaging**: Electron & Electron Builder
- **Real-time**: Socket.io

---

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js** (v18 or higher)
- **npm**

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/pawfinder.git
cd pawfinder

# Install dependencies
npm install
```

### 3. Run Web Server

```bash
npm start
```

Open your browser and navigate to `http://localhost:3000`.

### 4. Run Desktop App (Electron)

```bash
npm run electron
```

---

## 🌐 Deploy Live

### Option 1: Render.com / Railway (Full Stack)
1. Push this repository to GitHub.
2. Connect your repository to **Render** or **Railway**.
3. Set Start Command to: `npm start`
4. Set Port: `3000` (or `PORT` environment variable).

### Option 2: Local Public Tunnel (Quick Live Preview)
Run locally and expose instantly via **localtunnel** or **cloudflared**:

```bash
npx localtunnel --port 3000
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
