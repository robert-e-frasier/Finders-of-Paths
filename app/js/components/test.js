console.log('test.js is running');
console.log('GridStack exists:', typeof GridStack !== 'undefined');

document.addEventListener('DOMContentLoaded', () => {
    const grid = GridStack.init({ column: 12 });

    const el = document.createElement('div');
    el.classList.add('grid-stack-item');
    el.setAttribute('gs-x', '0');
    el.setAttribute('gs-y', '0');
    el.setAttribute('gs-w', '4');
    el.setAttribute('gs-h', '2');

    const content = document.createElement('div');
    content.classList.add('grid-stack-item-content');
    content.innerText = 'HELLO!';

    el.appendChild(content);
    document.querySelector('.grid-stack').appendChild(el);

    grid.makeWidget(el);
});