'use strict'
/** @module jshtml */

/*
    *****************************
    * SECTION: State Management *
    *****************************
*/

/** Single value state container */
export class State {
    #value;

    /**
     * @callback StateBinding
     * @param {*} newValue
     */
    /** @type {StateBinding[]} */
    #bindings = [];

    constructor(initialValue) {
        this.#value = initialValue;
    }

    /**
     * Updates the state value
     * @param {*} newValue
     */
    set(newValue) {
        this.#value = newValue;

        for (const callback of this.#bindings) {
            callback(this.#value);
        }
    }

    /**
     * Binds a callback function which is called when the value changes
     * @param {StateBinding} callback
     */
    bind(callback) {
        this.#bindings.push(callback);
    }

    /**
     * Returns the current value
     * @returns {*}
     */
    get value() {
        return this.#value;
    }

    /**
     * Returns the value as a string
     * @returns {string}
     */
    toString() {
        return this.#value.toString();
    }

    /**
     * Returns the value
     * @returns {*}
     */
    valueOf() {
        return this.#value;
    }
}

/**
 * Returns a new State object which contains the value
 * @param {*} initialValue
 * @returns {State}
 */
export function state(initialValue) {
    return new State(initialValue);
}

/**
 * Returns a State object which updates whenever a dependency updates
 * @param {Function} valueConstructor 
 * @param {State[]} dependencies 
 * @returns {State}
 */
export function memo(valueConstructor, dependencies) {
    const s = state(valueConstructor());

    for (const dependency of dependencies) {
        dependency.bind(() => {
            const newValue = valueConstructor();
            s.set(newValue);
        });
    }

    return s;
}

/**
 * Renders a component and will rerender when a dependencies value updates
 * @example
 * // This example shows how we rerender an unordered list when the items array gets updated
 * const items = state([ 'Item 1', 'Item 2' ]);
 * rerender(ul, { className: 'my-class' }, () => items.value.map(item => li(() => item)), [ items ]);
 * rerender(ul, () => items.value.map(item => li(() => item)), [ items ]);
 * @param {Function} component 
 * @param {Object | Function} arg0 Attributes or Children
 * @param {Function | State[]} arg1 Children or Dependencies
 * @param {?State[]} arg2 Dependencies
 * @returns {HTMLElement}
 */
export function rerender(component, arg0, arg1, arg2) {
    let attributes = {};
    let children = () => [];
    let dependencies = [];

    if (arg0 instanceof Function) {
        children = arg0;
        dependencies = arg1;
    } else {
        attributes = arg0;
        children = arg1;
        dependencies = arg2;
    }

    const parent = component(attributes, children);

    for (const dependency of dependencies) {
        dependency.bind(() => {
            const newChildren = children();
            parent.replaceChildren(...newChildren);
        });
    }

    return parent;
}


/*
    ************************
    * SECTION: Stylesheets *
    ************************
*/

/** Global stylesheet */
let stylesheet = null;

/**
 * Returns the global stylesheet
 * @returns {HTMLStyleElement}
 */
function getStylesheet() {
    if (stylesheet == null) {
        stylesheet = document.createElement('style');
        document.head.appendChild(stylesheet);
    }

    return stylesheet;
}

/**
 * Creates a styled component
 * @param {Function} component 
 * @param {string} styles 
 * @returns {Function}
 */
export function styled(component, styles) {
    const className = 'a' + (Math.floor(Math.random() * 100_000)).toString(26);

    const stylesheet = getStylesheet();
    stylesheet.innerHTML += `.${className} {${styles}}`;

    return (...args) => {    
        if (args.length == 2) {
            const attributes = args[0];

            if (attributes['className'] == undefined) {
                attributes['className'] = className;
            } else {
                attributes['className'] += ` ${className}`;
            }
        } else {
            args.unshift({ className });
        }

        return component(...args);
    }
}

/*
    *****************
    * SECTION: HTML *
    *****************
*/

/**
 * Valid types of primitives that createNode can accept
 * @constant {string[]}
 */
const CREATE_NODE_ACCEPTED_PRIMITIVE_TYPES = ['string', 'number', 'bigint', 'boolean'];

/**
 * Creates a valid HTML Node from an argument
 * @param {*} arg 
 * @returns {Node | null}
 */
function createNode(arg) {
    if (arg instanceof Node) {
        return arg;
    } else if (CREATE_NODE_ACCEPTED_PRIMITIVE_TYPES.includes(typeof arg)) {
        return document.createTextNode(arg.toString());
    } else if (arg instanceof State) {
        const node = document.createTextNode(arg.toString());

        arg.bind((newValue) => node.textContent = newValue.toString());

        return node;
    } else {
        return null;
    }
}

/**
 * Creates a html element with the attributes and children specified
 * @example
 * // Usage
 * html('h1'); // A plain header
 * html('h1', { className: 'my-header' }); // A header with a class
 * html('h1', () => 'Hello, World!'); // A header with some text
 * html('h1', { className: 'my-header' }, () => 'Hello, World!'); // A header with a class and text
 * @param {string} tag
 * @param {...object | Function} args Possible arguments: attributes, children | attributes | children
 * @returns {HTMLElement}
 */
export function html(tag, ...args) {
    // Get the attributes and children passed to the function
    let attributes = {};
    let childrenConstructor = () => [];

    if (args.length >= 1) {
        if (typeof args[0] == 'function') {
            childrenConstructor = args[0];
        } else if (args[0] instanceof Object) {
            attributes = args[0];
        }
    }

    if (args.length == 2 && typeof args[1] == 'function') {
        childrenConstructor = args[1];
    }

    // Create the element and apply the attributes and children
    const element = document.createElement(tag);

    for (const attributeKey of Object.keys(attributes)) {
        const attributeValue = attributes[attributeKey];

        if (attributeValue instanceof State) {
            attributeValue.bind((newValue) => {
                element[attributeKey] = newValue;
            });
        }

        element[attributeKey] = attributeValue;
    }

    let children = childrenConstructor();
    
    if (!(children instanceof Array)) {
        children = [children];
    }

    element.replaceChildren(...children.map(createNode));

    return element;
}

/**
 * Renders a component onto the DOM
 * @param {Function} component A function which returns a HTML Element
 * @param {string} root A HTML selector
 * @default 'body'
 * @param {boolean} replaceRoot When true the root element will be replaced by the component. When false the component is appended to the root element
 * @default false
 */
export function render(component, root = 'body', replaceRoot = false) {
    const renderedComponent = component();
    const rootElement = document.querySelector(root);

    if (replaceRoot) {
        rootElement.replaceWith(renderedComponent);
    } else {
        rootElement.appendChild(renderedComponent);
    }
}

/**
 * Componentizes a function.
 * Adds the `styled` and `rerender` functions
 * @param {Function} constructor 
 * @returns {Function}
 */
export function component(constructor) {
    constructor.styled = (styles) => styled(constructor, styles.join(''));
    constructor.rerender = (...args) => rerender(constructor, ...args);

    return constructor;
}

/**
 * Generate functions for all HTML5 tags as shorthand for the html function
 * Excludes `html` and `var`. Use the html function for these
 * @param {string} tag 
 * @returns {Function}
 */
function generateHTMLExport(tag) {
    const constructor = (...args) => html(tag, ...args);

    return component(constructor);
}

export const a = generateHTMLExport('a');
export const abbr = generateHTMLExport('abbr');
export const address = generateHTMLExport('address');
export const area = generateHTMLExport('area');
export const article = generateHTMLExport('article');
export const aside = generateHTMLExport('aside');
export const audio = generateHTMLExport('audio');
export const b = generateHTMLExport('b');
export const base = generateHTMLExport('base');
export const bdi = generateHTMLExport('bdi');
export const bdo = generateHTMLExport('bdo');
export const blockquote = generateHTMLExport('blockquote');
export const body = generateHTMLExport('body');
export const br = generateHTMLExport('br');
export const button = generateHTMLExport('button');
export const canvas = generateHTMLExport('canvas');
export const caption = generateHTMLExport('caption');
export const cite = generateHTMLExport('cite');
export const code = generateHTMLExport('code');
export const col = generateHTMLExport('col');
export const colgroup = generateHTMLExport('colgroup');
export const data = generateHTMLExport('data');
export const datalist = generateHTMLExport('datalist');
export const dd = generateHTMLExport('dd');
export const del = generateHTMLExport('del');
export const details = generateHTMLExport('details');
export const dfn = generateHTMLExport('dfn');
export const dialog = generateHTMLExport('dialog');
export const div = generateHTMLExport('div');
export const dl = generateHTMLExport('dl');
export const dt = generateHTMLExport('dt');
export const em = generateHTMLExport('em');
export const embed = generateHTMLExport('embed');
export const fieldset = generateHTMLExport('fieldset');
export const figcaption = generateHTMLExport('figcaption');
export const figure = generateHTMLExport('figure');
export const footer = generateHTMLExport('footer');
export const form = generateHTMLExport('form');
export const h1 = generateHTMLExport('h1');
export const head = generateHTMLExport('head');
export const header = generateHTMLExport('header');
export const hgroup = generateHTMLExport('hgroup');
export const hr = generateHTMLExport('hr');
export const i = generateHTMLExport('i');
export const iframe = generateHTMLExport('iframe');
export const img = generateHTMLExport('img');
export const input = generateHTMLExport('input');
export const ins = generateHTMLExport('ins');
export const kbd = generateHTMLExport('kbd');
export const label = generateHTMLExport('label');
export const legend = generateHTMLExport('legend');
export const li = generateHTMLExport('li');
export const link = generateHTMLExport('link');
export const main = generateHTMLExport('main');
export const map = generateHTMLExport('map');
export const mark = generateHTMLExport('mark');
export const menu = generateHTMLExport('menu');
export const meta = generateHTMLExport('meta');
export const meter = generateHTMLExport('meter');
export const nav = generateHTMLExport('nav');
export const noscript = generateHTMLExport('noscript');
export const object = generateHTMLExport('object');
export const ol = generateHTMLExport('ol');
export const optgroup = generateHTMLExport('optgroup');
export const option = generateHTMLExport('option');
export const output = generateHTMLExport('output');
export const p = generateHTMLExport('p');
export const picture = generateHTMLExport('picture');
export const pre = generateHTMLExport('pre');
export const progress = generateHTMLExport('progress');
export const q = generateHTMLExport('q');
export const rp = generateHTMLExport('rp');
export const rt = generateHTMLExport('rt');
export const ruby = generateHTMLExport('ruby');
export const s = generateHTMLExport('s');
export const samp = generateHTMLExport('samp');
export const script = generateHTMLExport('script');
export const search = generateHTMLExport('search');
export const section = generateHTMLExport('section');
export const select = generateHTMLExport('select');
export const slot = generateHTMLExport('slot');
export const small = generateHTMLExport('small');
export const source = generateHTMLExport('source');
export const span = generateHTMLExport('span');
export const strong = generateHTMLExport('strong');
export const style = generateHTMLExport('style');
export const sub = generateHTMLExport('sub');
export const summary = generateHTMLExport('summary');
export const sup = generateHTMLExport('sup');
export const table = generateHTMLExport('table');
export const tbody = generateHTMLExport('tbody');
export const td = generateHTMLExport('td');
export const template = generateHTMLExport('template');
export const textarea = generateHTMLExport('textarea');
export const tfoot = generateHTMLExport('tfoot');
export const th = generateHTMLExport('th');
export const thead = generateHTMLExport('thead');
export const time = generateHTMLExport('time');
export const title = generateHTMLExport('title');
export const tr = generateHTMLExport('tr');
export const track = generateHTMLExport('track');
export const u = generateHTMLExport('u');
export const ul = generateHTMLExport('ul');
export const video = generateHTMLExport('video');
export const wbr = generateHTMLExport('wbr');
