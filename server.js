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

app.post('/shorten', (req, res) => {
    const originalURL = req.body.url;

    if (!originalURL || !originalURL.startsWith('http')) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    const db = loadDB();

    let code = generateCode();
    while (db[code]) {
        code = generateCode();
    }

    db[code] = originalURL;
    saveDB(db);

    res.json({
    shortLink: `https://shrnkr.com/${code}`
    });
});

app.get('/:code', (req, res) => {
    const db = loadDB();
    const url = db[req.params.code];

    if (url) {
        res.redirect(url); 
    } else {
        res.status(404).send("Invalid or expired link");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});