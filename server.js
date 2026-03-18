const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://pb-mongodb:<db_password>@shrnkrcluster.qzodsan.mongodb.net/?appName=shrnkrCluster";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

const urlSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    originalURL: String,
    createdAt: { type: Date, default: Date.now }
});

const URL = mongoose.model('URL', urlSchema);

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const dbFile = path.join(__dirname, 'urls.json');

const loadDB = () => {
    if (!fs.existsSync(dbFile)) {
        fs.writeFileSync(dbFile, '{}');
    }
    return JSON.parse(fs.readFileSync(dbFile));
};

const saveDB = (db) => {
    fs.writeFileSync(dbFile, JSON.stringify(db, null, 4));
};

const generateCode = () => Math.random().toString(36).substring(2, 7);

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