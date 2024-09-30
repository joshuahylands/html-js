import hljs from 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/es/highlight.min.js';

import { body, code, div, h1, h2, h3, h4, header, pre, render, section, button, a, figure, state } from '/htmljs.mjs';
import Navbar from './Navbar.mjs';

const HelloWorldExample = () => {
    return h4(() => 'Hello, World!');
};

const CounterExample = () => {
    const count = state(0);

    return div(() => [
        h4(() => [ 'Count: ', count ]),
        button({ class: 'btn btn-danger', onclick: () => count.set(count - 1) }, () => '-'),
        button({ class: 'btn btn-success', onclick: () => count.set(count + 1) }, () => '+')
    ]);
};

const StyledH1 = h4.styled`
    color: lightgreen;
`;

function StyledExample() {
    return StyledH1(() => 'Hello, World!');
}

const App = () => {
    return body({ 'data-bs-theme': 'dark' }, () => [
        Navbar(),
        header({ class: 'container py-5 text-center' }, () => [
            h1(() => 'html-js'),
            h3(() => 'Create fully functional and styled web apps all within JavaScript'),
            a({ class: 'btn btn-primary', href: '/learn' }, () => 'Learn'),
            a({ class: 'btn btn-outline-secondary', href: '/docs/global.html' }, () => 'API Reference')
        ]),
        section({ class: 'bg-body-tertiary container-fluid py-5 d-flex flex-column justify-content-center align-items-center' }, () => [
            h2(() => 'Create reuseable components in JavaScript'),
            pre({ class: 'card flex-row' }, () => [
                code(() => [
                    `function App() {\n`,
                    `  return h1(() => 'Hello, World!');\n`,
                    `}`
                ]),
                figure({ class: 'card-body px-5 d-flex justify-content-center align-items-center text-center' }, HelloWorldExample)
            ])
        ]),
        section({ class: 'container-fluid py-5 d-flex flex-column justify-content-center align-items-center' }, () => [
            h2(() => 'Add interactivity using State APIs'),
            pre({ class: 'card flex-row' }, () => [
                code(() => [
                    `function Counter() {\n`,
                    `  const count = state(0);\n`,
                    `\n`,
                    `  return div(() => [\n`,
                    `    h1(() => [ 'Count: ', count ]),\n`,
                    `    button({ onclick: () => count.set(count - 1) }, () => '-'),\n`,
                    `    button({ onclick: () => count.set(count + 1) }, () => '+')\n`,
                    `  ]);\n`,
                    `}\n`
                ]),
                figure({ class: 'card-body px-5 d-flex justify-content-center align-items-center text-center' }, CounterExample)
            ]),
            button({ class: 'btn btn-outline-secondary' }, () => 'Learn about the State APIs')
        ]),
        section({ class: 'bg-body-tertiary container-fluid py-5 d-flex flex-column justify-content-center align-items-center' }, () => [
            h2(() => 'Make your components look good with the Styles API'),
            pre({ class: 'card flex-row' }, () => [
                code(() => [
                    `const StyledH1 = h1.styled\`\n`,
                    `  color: lightgreen;\n`,
                    `\`;\n`,
                    `\n`,
                    `function StyledApp() {\n`,
                    `  return StyledH1(() => 'Hello, World!');\n`,
                    `}\n`
                ]),
                figure({ class: 'card-body px-5 d-flex justify-content-center align-items-center text-center' }, StyledExample)
            ]),
            button({ class: 'btn btn-outline-secondary' }, () => 'Style your components')
        ])
    ]);
};

render(App, 'body', true);
hljs.highlightAll();
