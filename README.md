<div align="center">
  <br />
  <a href="https://tic-tac-toe-gcrs.onrender.com" target="_blank">
    <img src="https://github.com/Dharambirbro/Tic_tac_Toe/blob/main/home.png" alt="Project Banner" style="border-radius: 30px; object-fit: cover;">
  </a>
  <br /><br />
  <img src="https://img.shields.io/badge/-Node_JS-black?style=for-the-badge&logoColor=white&logo=nodedotjs&color=339933" alt="Node.js" />
  <img src="https://img.shields.io/badge/-Socket.IO-black?style=for-the-badge&logoColor=white&logo=socket.io&color=010101" alt="Socket.IO" />
</div>

<h3 align="center">Tic Tac Toe — Multiplayer + Unbeatable AI Bot</h3>
<p align="center">A dynamic Tic Tac Toe game built with Node.js, Express, and Socket.IO, featuring real-time online multiplayer and an unbeatable AI powered by Minimax.</p>

---

## 📋 Table of Contents

1. 🚀 [Live Demo](#live-demo)
2. 🤖 [Introduction](#introduction)
3. 🧠 [The AI Bot (Minimax)](#the-ai-bot-minimax)
4. ⚙️ [Tech Stack](#tech-stack)
5. 🔋 [Features](#features)
6. 🤸 [Quick Start](#quick-start)
7. 🛠️ [Project Structure](#project-structure)
8. 📬 [Contact](#contact)

---

## 🚀 Live Demo

Play the game live:

👉 [https://tic-tac-toe-gcrs.onrender.com](https://tic-tac-toe-gcrs.onrender.com)

<div align="center">
  <a href="https://tic-tac-toe-gcrs.onrender.com">
    <img src="https://github.com/Dharambirbro/Tic_tac_Toe/blob/main/online.png" width="400">
  </a>
  <a href="https://tic-tac-toe-gcrs.onrender.com">
    <img src="https://github.com/Dharambirbro/Tic_tac_Toe/blob/main/bot.png" width="400">
  </a>
  <a href="https://tic-tac-toe-gcrs.onrender.com">
    <img src="https://github.com/Dharambirbro/Tic_tac_Toe/blob/main/demo.png" width="400">
  </a>
</div>

---

## 🤖 Introduction

This is a fun and interactive web-based **Tic Tac Toe** game where users can:

- 🔹 Play **against a bot** powered by the **Minimax algorithm**.
- 🔹 Invite and play **online in real-time** with friends using **Socket.IO**.
- 🔹 Enjoy a clean and simple interface, perfect for casual gameplay.

Built on a lightweight **Node.js server**, this project demonstrates a powerful mix of **frontend simplicity** and **backend intelligence**.

---

## 🧠 The AI Bot (Minimax)

The AI in this game uses the classic **Minimax algorithm**, which ensures the bot makes optimal moves and is practically unbeatable.

### 🧩 How Minimax Works:

- **Minimax** is a recursive algorithm used in decision-making and game theory.
- It explores all possible moves of both the **player** and the **opponent** to determine the best outcome.
- It assigns scores:
  - X → +1
  - O → -1
  - Draw → 0
- The bot chooses the move that **maximizes its chances** of winning while minimizing the player’s.

### 🎯 Why it’s effective:

- It evaluates **every possible game state**.
- Prevents the player from winning if there's any chance to block.
- It’s perfect for simple games like Tic Tac Toe where the number of states is finite.

> Want to beat the bot? Try a draw — that’s the best you’ll get 😄

---

## ⚙️ Tech Stack

- 🟢 **Node.js** – Backend runtime environment.
- ⚪ **Express.js** – Server framework.
- 🧩 **Socket.IO** – Real-time multiplayer functionality.
- 🧾 **HTML/CSS/JS** – Clean and lightweight frontend.

---

## 🔋 Features

- ✅ **AI Bot with Minimax**: Unbeatable bot logic ensures challenging gameplay.
- 🌐 **Real-time Online Multiplayer**: Play with friends across the globe.
- 🎨 **Responsive Design**: Works seamlessly on desktop and mobile.
- 🚀 **Lightweight Server**: Efficient backend with fast socket communication.

---

## 🤸 Quick Start

### 📦 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

### 🛠️ Setup Instructions

```bash
# Clone the repository
git clone https://github.com/Dharambirbro/Tic_tac_Toe.git
cd Tic_tac_Toe

# Install dependencies
npm install

# Set environment variables
echo "PORT=8080" > .env

# Run the server
npm start
```

Then open your browser and go to: [http://localhost:8080](http://localhost:8080)

---

## 🗂️ Project Structure

```bash
Tic_tac_Toe/
├── public/              # Frontend files (HTML/CSS/JS)
│   ├── index.html
│   └── ...
├── src/
│   ├── server.js        # Main server file
│   ├── bot.js           # Minimax algorithm logic
│   └── ...
├── .env
├── package.json
└── README.md
```

---

## 📬 Contact

Feel free to reach out if you face issues or have suggestions:

📧 Email: [dev.dharambir@gmail.com](mailto:dev.dharambir@gmail.com)  
⭐ GitHub: [@DharambirAgrawal](https://github.com/DharambirAgrawal)

If you like this project, consider giving it a ⭐ on GitHub — it helps a lot!

---

<div align="center">
  Built with 💚 using Node.js and passion for logic games.
</div>