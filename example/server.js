const express = require('express');
const path = require('path');

const app = express();

app.get('/', (_, res) => res.sendFile(path.resolve(__dirname, 'index.html')));
app.get('/example.js', (_, res) => res.sendFile(path.resolve(__dirname, 'example.js')));
app.get('/htmljs.mjs', (_, res) => res.sendFile(path.resolve(__dirname, '..', 'htmljs.mjs')));

const PORT = process.env.PORT | 8000;

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}/`));
