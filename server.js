const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

const mongoURI = process.env.MONGO_URI;;

mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

const urlSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    originalURL: String,
    createdAt: { type: Date, default: Date.now }
});

const URL = mongoose.model('URL', urlSchema);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/result', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'result.html'));
});

app.post('/shorten', async (req, res) => {
    const originalURL = req.body.url;

    if (!originalURL || !originalURL.startsWith('http')) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    let code = Math.random().toString(36).substring(2, 7);
    while (await URL.findOne({ code })) {
        code = Math.random().toString(36).substring(2, 7);
    }

    const newURL = new URL({ code, originalURL });
    await newURL.save();

    res.json({
        shortLink: `${req.protocol}://${req.get('host')}/${code}`
    });
});

app.get('/:code', async (req, res) => {
    const code = req.params.code;
    const urlDoc = await URL.findOne({ code });

    if (urlDoc) {
        res.redirect(urlDoc.originalURL);
    } else {
        res.status(404).send("Invalid or expired link");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});