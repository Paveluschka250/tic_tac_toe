// Zeichnet eine animierte Linie über die Gewinnkombination und ruft callback nach Animation auf
function drawWinLine(indices, callback) {
    const container = document.getElementById('container');
    if (!container) {
        if (callback) callback();
        return;
    }
    // Entferne alte Linie, falls vorhanden
    const oldLine = document.getElementById('win-line');
    if (oldLine) oldLine.remove();

    // Positionen der Zellen im Grid bestimmen
    const cells = Array.from(container.children);
    if (cells.length < 9) {
        if (callback) callback();
        return;
    }
    const getCellCenter = idx => {
        const rect = cells[idx].getBoundingClientRect();
        const parentRect = container.getBoundingClientRect();
        return {
            x: rect.left - parentRect.left + rect.width / 2,
            y: rect.top - parentRect.top + rect.height / 2
        };
    };
    const start = getCellCenter(indices[0]);
    const end = getCellCenter(indices[2]);

    // Linie als div erstellen
    const line = document.createElement('div');
    line.id = 'win-line';
    line.className = 'win-line';
    // Länge und Winkel berechnen
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    line.style.width = '0px';
    line.style.height = '5px';
    line.style.background = 'linear-gradient(90deg, #4be1ff, #ff4b4b)';
    line.style.position = 'absolute';
    line.style.left = `${start.x}px`;
    line.style.top = `${start.y - 2.5}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = `top left`;
    line.style.borderRadius = '4px';
    line.style.zIndex = '900';
    line.style.transition = 'width 0.5s cubic-bezier(.68,-0.55,.27,1.55)';
    container.appendChild(line);

    // Trigger Animation
    setTimeout(() => {
        line.style.width = `${length}px`;
    }, 30);

    // Nach Animation Overlay anzeigen
    setTimeout(() => {
        if (callback) callback();
    }, 600);
}
// This file contains the main game logic for the Tic Tac Toe game.

let board;
let currentPlayer;
let gameActive;

function init() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'O'; // Start with O (circle)
    gameActive = true;
    render();
    updateIndicators();
    hideOverlay();
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.onclick = () => {
            init();
        };
    }
}

function render() {
    const container = document.getElementById('container');
    container.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.setAttribute('data-cell-index', index);
        if (cell === 'O') {
            cellElement.classList.add('circle');
            cellElement.innerText = '◯';
        } else if (cell === 'X') {
            cellElement.classList.add('cross');
            cellElement.innerText = '✕';
        } else {
            cellElement.innerText = '';
        }
        cellElement.addEventListener('click', handleCellClick, { once: true });
        container.appendChild(cellElement);
    });
}

function handleCellClick(event) {
    const clickedCellIndex = event.target.getAttribute('data-cell-index');
    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }
    board[clickedCellIndex] = currentPlayer;
    animateCell(event.target, currentPlayer);
    setTimeout(() => {
        checkResult();
    }, 300); // Wait for animation
}

function animateCell(cellElement, player) {
    if (player === 'O') {
        cellElement.classList.add('circle');
        cellElement.innerText = '◯';
    } else {
        cellElement.classList.add('cross');
        cellElement.innerText = '✕';
    }
}

function checkResult() {
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    let roundWon = false;
    let winner = null;
    let winLine = null;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === '' || board[b] === '' || board[c] === '') {
            continue;
        }
        if (board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winner = board[a];
            winLine = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        drawWinLine(winLine, () => {
            showOverlay(`${winner === 'O' ? 'Kreis' : 'Kreuz'} hat gewonnen!`);
        });
        return;
    }

    if (!board.includes('')) {
        showOverlay('Unentschieden!');
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
    updateIndicators();
}

function updateIndicators() {
    const circle = document.getElementById('circle-indicator');
    const cross = document.getElementById('cross-indicator');
    if (!circle || !cross) return;
    if (currentPlayer === 'O') {
        circle.classList.add('active-indicator');
        cross.classList.remove('active-indicator');
    } else {
        cross.classList.add('active-indicator');
        circle.classList.remove('active-indicator');
    }
}

function showOverlay(message) {
    const overlay = document.getElementById('overlay');
    const overlayMsg = document.getElementById('overlay-message');
    if (overlay && overlayMsg) {
        // Entferne alte Siegklassen
        overlayMsg.classList.remove('win-circle', 'win-cross', 'draw');
        // Prüfe auf Sieg-Text und ersetze durch animiertes Symbol
        if (message && message.includes('hat gewonnen')) {
            let winnerSymbol = '';
            let winnerClass = '';
            let overlayClass = '';
            if (message.startsWith('Kreis')) {
                winnerSymbol = '◯';
                winnerClass = 'circle';
                overlayClass = 'win-circle';
            } else if (message.startsWith('Kreuz')) {
                winnerSymbol = '✕';
                winnerClass = 'cross';
                overlayClass = 'win-cross';
            }
            overlayMsg.innerHTML = `<span class="indicator ${winnerClass}" style="font-size:2.5rem;vertical-align:middle;">${winnerSymbol}</span> <span style="font-size:1.3rem;vertical-align:middle;">hat gewonnen!</span>`;
            overlayMsg.classList.add(overlayClass);
        } else if (message && message.toLowerCase().includes('unentschieden')) {
            overlayMsg.innerText = message;
            overlayMsg.classList.add('draw');
        } else {
            overlayMsg.innerText = message;
        }
        overlay.classList.add('active');
    }
}

function hideOverlay() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}