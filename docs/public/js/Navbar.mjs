import { a, div, img, nav, li, ul } from '/htmljs.mjs';

export default function Navbar() {
    return nav({ class: 'navbar navbar-expand-md' }, () => [
        div({ class: 'container-fluid' }, () => [
            a({ class: 'navbar-brand', href: '/' }, () => 'html-js'),
            ul({ class: 'navbar-nav' }, () => [
                li({ class: 'nav-item' }, () => [
                    a({ class: 'nav-link', href: '/learn' }, () => 'Learn')
                ]),
                li({ class: 'nav-item' }, () => [
                    a({ class: 'nav-link', href: '/docs/global.html' }, () => 'Reference')
                ]),
                li({ class: 'nav-item' }, () => [
                    a({ class: 'nav-link', href: 'https://github.com/joshuahylands/html-js' }, () => [
                        img({ src: '/public/img/github-mark-white.svg', height: 24 })
                    ])
                ])
            ])
        ])
    ]);
}
