import hljs from 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/es/highlight.min.js';
import { render } from '/htmljs.mjs';
import Navbar from './Navbar.mjs';

render(Navbar, '#navbar', true);
hljs.highlightAll();
