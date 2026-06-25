# Edulense App

Edulense is an AI-powered educational web application designed to enhance learning experiences. It features an interactive platform focused on the **Constitution of India**, integrating Natural Language Processing (NLP) and Large Language Models (LLMs) to provide intelligent quizzes, document highlighting, feedback mechanisms, and progress tracking.

## 🚀 Features

- **AI-Powered Learning:** Integrates OpenAI and Google GenAI APIs for intelligent, context-aware learning experiences.
- **NLP Capabilities:** Processes and analyzes text data (e.g., Constitution of India dataset) using Natural Language Processing techniques.
- **Interactive Quizzes:** Test your knowledge with quizzes and evaluate learning outcomes.
- **Progress Tracking:** Visualize learning progress using interactive charts and analytics.
- **Document Highlighting:** Highlight, save, and manage important parts of the educational text.
- **Rich Text Editing:** Integrated with React Quill for comprehensive rich text notes and feedback.
- **Secure Authentication:** User authentication and secure credential management using bcrypt.

## 💻 Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Data Visualization:** Recharts
- **Rich Text Editor:** React Quill
- **API Client:** Axios

### Backend
- **Server:** Node.js with Express.js
- **Database:** MongoDB & Mongoose
- **AI & NLP:** Google GenAI, and `natural` NLP library
- **Security:** `bcrypt` for password hashing
- **File Uploads:** `multer`
- **Data Parsing:** `csv-parser`

## 🛠️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or a MongoDB Atlas URI)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Edulense_App.git
cd Edulense_App
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add the following variables:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/edulense
# Add your AI API Keys here:
GEMINI_API_KEY=your_google_genai_api_key
# Add other secret keys as required (e.g., JWT_SECRET)
```
Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

## 📂 Project Structure

```text
Edulense_App/
├── backend/            # Express server, MongoDB models, Routes, NLP utils
├── frontend/           # React frontend, Tailwind CSS, Vite config
├── index.html          # Main HTML entry point
├── README.md           # Project documentation
└── setup_frontend.bat  # Script for quick frontend setup
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a Pull Request.

## 📝 License

This project is licensed under the ISC License (as specified in backend configuration) / MIT License.
