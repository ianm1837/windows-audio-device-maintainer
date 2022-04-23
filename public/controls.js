const win = require('electron').remote.getCurrentWindow();
const closeButton = document.querySelector('.button.close');
const minimizeButton = document.querySelector('.button.minimize');
const maximizeButton = document.querySelector('.button.maximize');

let isMaximized = false;

closeButton.addEventListener('click', () => win.close());
minimizeButton.addEventListener('click', () => win.minimize());
maximizeButton.addEventListener('click', () => {
    isMaximized = !isMaximized;
    isMaximized ? win.unmaximize() : win.maximize();
});