import express from 'express';
import * as path from 'node:path';

const app = express();

app.use('/docs', express.static(path.resolve(import.meta.dirname, 'jsdoc')));
app.use('/public', express.static(path.resolve(import.meta.dirname, 'public')));

app.get('/htmljs.mjs', (_, res) => res.sendFile(path.resolve(import.meta.dirname, '..', 'htmljs.mjs')));
app.get('*', (_, res) => res.sendFile(path.resolve(import.meta.dirname, 'index.html')));

const PORT = process.env.PORT | 8000;

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}/`));
