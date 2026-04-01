# ESHINE — AI-Powered Fashion E-Commerce Platform

> An e-commerce website for fashion, enhanced with an AI backend for smart product recommendations and styling features.

---

## 📁 Project Structure

```
AI-PROJECT/
├── ESHINE-Front-End/       # Frontend web application (HTML, CSS, JavaScript)
├── Fashion-AI-Backend/     # AI-powered backend service (Python)
└── AI-PROJECT.code-workspace
```

---

## 🛠️ Tech Stack

| Layer      | Technologies              |
|------------|---------------------------|
| Frontend   | HTML, CSS, JavaScript     |
| Backend    | Python                    |
| Tooling    | VS Code Workspace         |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (for serving the frontend locally)
- [Python 3.8+](https://www.python.org/)
- [pip](https://pip.pypa.io/)

---

### Frontend Setup

```bash
# Navigate to the frontend directory
cd ESHINE-Front-End

# Open index.html directly in your browser, or use a local server:
npx serve .
```

---

### Backend Setup

```bash
# Navigate to the backend directory
cd Fashion-AI-Backend

# Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python app.py
```

> Make sure the frontend is configured to point to the correct backend URL (e.g., `http://localhost:5000`).

---

## ✨ Features

- 🛍️ **E-Commerce Storefront** — Browse and explore fashion products via a clean, responsive UI
- 🤖 **AI Backend** — Python-powered backend for intelligent product recommendations or outfit suggestions
- 🎨 **Modern Frontend** — Built with vanilla HTML, CSS, and JavaScript for fast load times
- 🔗 **Decoupled Architecture** — Frontend and backend are independently structured for easy development

---

## 📂 Folder Details

### `ESHINE-Front-End/`
Contains the complete frontend of the ESHINE e-commerce platform, including:
- Product listing and detail pages
- Shopping cart UI
- Responsive layout and styling

### `Fashion-AI-Backend/`
Contains the Python-based AI service, including:
- API endpoints for the frontend to consume
- AI/ML logic for fashion-related features (recommendations, styling, 