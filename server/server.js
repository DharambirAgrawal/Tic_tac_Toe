// app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the game page
app.get('/bot', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/bot', 'bot.html'));
});

app.get('/online', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/online', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
