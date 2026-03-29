# 🛒 ReUseHub - Smart Classifieds Marketplace

A modern, full-stack classifieds marketplace application that allows users to seamlessly buy and sell used products locally. Built with the MERN stack (MongoDB, Express, React, Node.js) and features real-time instant messaging using Socket.io.

## ✨ Key Features

- **Modern Responsive Design**: Built with React and Tailwind CSS for mobile-first scalability.
- **Secure Authentication**: JWT-based login and registration with bcrypt password hashing.
- **Dynamic Marketplace**: Users can browse dynamically populated product listings separated by real-world categories (Electronics, Vehicles, Furniture, Fashion, Sports, Books, Other).
- **Product Management**: Upload beautiful listings with titles, descriptions, conditions, localized pricing, and integrated Base64 image uploads.
- **Real-Time B2C Chat**: Buyer-to-Seller chat rooms implemented seamlessly via WebSocket (Socket.io). Message histories are safely stored in the database.
- **Smart Filtering & Searching**: Instantly find desired products by searching names or sorting by specific product categories on the homepage.
- **User Profiles**: Securely view user profiles and upload customized profile avatars dynamically.

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** (Styling/Theming)
- **React Router** (Navigation)
- **Lucide-React** (Icons)
- **Axios** (API integration)
- **Socket.io-client** (Real-time updates)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database / Schemas)
- **Socket.io** (WebSocket communication)
- **JSON Web Tokens (JWT)** (Authentication)

## 🚀 Local Development Setup

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/iamYogeshMohan/ReUseHub-Smart-Classifieds-Marketplace.git
cd ReUseHub-Smart-Classifieds-Marketplace
\`\`\`

### 2. Configure Backend
Navigate to the \`backend\` directory and install dependencies:
\`\`\`bash
cd backend
npm install
\`\`\`
Create a \`.env\` file in the \`backend\` folder with the following variables:
\`\`\`env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/reusehub
JWT_SECRET=supersecretjwtkey_reusehub_2026
\`\`\`

### 3. Run Database Seeds (Optional but Recommended)
Populate the local MongoDB database with realistic users and over 50 real-world products using high-quality placeholder images.
\`\`\`bash
node seeds.js
\`\`\`

### 4. Configure Frontend
Open a new terminal, navigate to the \`frontend\` directory, and install dependencies:
\`\`\`bash
cd frontend
npm install
\`\`\`

### 5. Launch the Application
Run both servers simultaneously:
**Backend Server:**
\`\`\`bash
npm run dev
\`\`\`
**Frontend Server:**
\`\`\`bash
npm run dev
\`\`\`

The application will be running on \`http://localhost:5173\`.

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.
