const express = require('express');
const path = require('path');

const app = express();

app.get('/', (_, res) => res.sendFile(path.resolve(__dirname, 'index.html')));
app.get('/example.js', (_, res) => res.sendFile(path.resolve(__dirname, 'example.js')));
app.get('/jshtml.mjs', (_, res) => res.sendFile(path.resolve(__dirname, '..', 'jshtml.mjs')));

const PORT = process.env.PORT | 8000;

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}/`));
