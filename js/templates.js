function createGameGrid() {
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid-container';

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.index = i;
        gridContainer.appendChild(cell);
    }

    return gridContainer;
}

function createOverlayMessage(message) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    const messageElement = document.createElement('div');
    messageElement.className = 'overlay-message';
    messageElement.textContent = message;

    overlay.appendChild(messageElement);
    return overlay;
}

export { createGameGrid, createOverlayMessage };