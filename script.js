const gridElement = document.getElementById('grid');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level-display');

let score = 0;
let currentLevel = 0;
const maps = [
    //1) muro, 2)vuoto, 0)pallino
    [
        1,1,1,1,1,1,1,1,1,1,
        1,0,0,0,1,0,0,0,0,1,
        1,0,1,0,1,0,1,1,0,1,
        1,0,1,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,0,1,
        1,0,0,0,0,0,0,1,0,1,
        1,1,1,0,1,1,0,1,0,1,
        1,0,0,0,0,1,0,0,0,1,
        1,0,1,1,0,0,0,1,0,1,
        1,1,1,1,1,1,1,1,1,1
    ],
    [
        1,1,1,1,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,1,
        1,0,1,1,0,1,1,1,0,1,
        1,0,1,0,0,0,1,0,0,1,
        1,0,0,0,1,0,0,0,1,1,
        1,1,1,0,1,1,1,0,0,1,
        1,0,0,0,0,0,0,1,0,1,
        1,0,1,1,1,1,0,1,0,1,
        1,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,1,1,1,1
    ]
];

let layout = [...maps[currentLevel]];
const width = 10;
let pacmanIndex = 11;
let ghosts = [
    { index: 18, direction: 1 },
    { index: 81, direction: -1 }
];

function createBoard() {
    gridElement.innerHTML = '';
    layout.forEach((cell, i) => {
        const div = document.createElement('div');
        div.classList.add('cell');
        if (cell === 1) div.classList.add('wall');
        if (cell === 0) div.classList.add('dot');
        if (i === pacmanIndex) div.classList.add('pacman');
        
        ghosts.forEach(g => {
            if (i === g.index) div.classList.add('ghost');
        });
        
        gridElement.appendChild(div);
    });
}

function movePacman(e) {
    let nextIndex = pacmanIndex;
    if (e.key === 'ArrowLeft' && pacmanIndex % width !== 0) nextIndex -= 1;
    if (e.key === 'ArrowRight' && pacmanIndex % width < width - 1) nextIndex += 1;
    if (e.key === 'ArrowUp' && pacmanIndex >= width) nextIndex -= width;
    if (e.key === 'ArrowDown' && pacmanIndex < width * (width - 1)) nextIndex += width;

    if (layout[nextIndex] !== 1) {
        pacmanIndex = nextIndex;
        if (layout[pacmanIndex] === 0) {
            layout[pacmanIndex] = 2; // Mangia il pallino
            score += 10;
            scoreElement.innerText = score;
        }
    }
    checkGameOver();
    checkWin();
    createBoard();
}

function moveGhosts() {
    ghosts.forEach(g => {
        const directions = [-1, 1, width, -width];
        const randomDir = directions[Math.floor(Math.random() * directions.length)];
        
        if (layout[g.index + randomDir] !== 1) {
            g.index += randomDir;
        }
    });
    checkGameOver();
    createBoard();
}

function checkGameOver() {
    if (ghosts.some(g => g.index === pacmanIndex)) {
        alert("Game Over!");
        resetGame();
    }
}

function checkWin() {
    if (!layout.includes(0)) {
        if (currentLevel === 0) {
            alert("Livello 1 completato!");
            currentLevel = 1;
            levelElement.innerText = "2";
            layout = [...maps[currentLevel]];
            pacmanIndex = 11;
        } else {
            alert("Hai vinto tutto!");
            resetGame();
        }
    }
}

function resetGame() {
    currentLevel = 0;
    levelElement.innerText = "1";
    score = 0;
    scoreElement.innerText = score;
    layout = [...maps[currentLevel]];
    pacmanIndex = 11;
}

document.addEventListener('keydown', movePacman);
setInterval(moveGhosts, 400); // I fantasmi si muovono ogni 400ms
createBoard();