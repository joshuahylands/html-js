import { button, div, h1, input, li, memo, render, state, ul } from './htmljs.mjs';

const Counter = () => {
    const count = state(0);

    return div(() => [
        h1(() => [ 'Count: ', count ]),
        button({ onclick: () => count.set(count - 1) }, () => '-'),
        button({ onclick: () => count.set(count + 1) }, () => '+')
    ]);
};

const Todo = () => {
    const items = state([ 'A', 'B', 'C' ]);

    const inputField = input({ placeholder: 'Add Item...' });
    const buttonOnClick = () => {
        items.set([ ...items.value, inputField.value ]);
        inputField.value = '';
    };

    return div(() => [
        h1(() => 'TODO List:'),
        ul.rerender(() => items.value.map(item => li(() => item)), [items]),
        inputField,
        button({ onclick: buttonOnClick }, () => 'Add')
    ]);
};

const ColorPicker = () => {
    const color = state('blue');
    const style = memo(() => `color: ${color.value}`, [color]);

    return div(() => [
        h1({ style }, () => 'Choose a color'),
        input({ placeholder: 'Color...', value: color.value, onkeyup: (e) => color.set(e.target.value) })
    ]);
};

const AppContainer = div.styled`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-family: Arial, Helvetica, sans-serif;
`;

const App = () => {
    return AppContainer(() => [
        Counter(),
        Todo(),
        ColorPicker()
    ]);
};

render(App);
