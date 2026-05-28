const canvas    = document.getElementById("gameCanvas");
const ctx       = canvas.getContext("2d");
const scoreEl   = document.getElementById("score");
const levelEl   = document.getElementById("level");
const livesEl   = document.getElementById("lives");
const messageEl = document.getElementById("message");

//Stato globale 
let currentMapIdx = 0;
let score         = 0;
let lives         = 3;
let map, pacman, ghosts;
let gameOver      = false;

// Animazione bocca
let mouthAngle = 0.25;
let mouthDir   = 1;

// Helper
function isWalkable(map, x, y) {
  return map[y] !== undefined
      && map[y][x] !== undefined
      && map[y][x] !== 1;
}

function countDots() {
  let n = 0;
  for (const row of map) for (const cell of row) if (cell === 0) n++;
  return n;
}

//  Inizializzazione livello 
function initLevel() {
  gameOver = false;
  map = JSON.parse(JSON.stringify(MAPS[currentMapIdx]));

  canvas.width  = map[0].length * TILE;
  canvas.height = map.length    * TILE;

  pacman = new Pacman(1, 1);

  const maxY = map.length    - 2;
  const maxX = map[0].length - 2;
  ghosts = [
    new Ghost(maxX, 1,    GHOST_COLORS[0]),  // alto destra   – rosso
    new Ghost(maxX, maxY, GHOST_COLORS[1]),  // basso destra  – cyan
    new Ghost(1,    maxY, GHOST_COLORS[2]),  // basso sinistra – rosa
  ];

  levelEl.textContent   = currentMapIdx + 1;
  messageEl.textContent = "";
  draw();
}

// Disegno
function drawMap() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const cell = map[y][x];
      const px   = x * TILE;
      const py   = y * TILE;

      if (cell === 1) {
        ctx.fillStyle = "#1919A6";
        ctx.fillRect(px, py, TILE, TILE);
        ctx.strokeStyle = "#3333CC";
        ctx.lineWidth = 1;
        ctx.strokeRect(px + 1, py + 1, TILE - 2, TILE - 2);
      } else {
        ctx.fillStyle = "#000";
        ctx.fillRect(px, py, TILE, TILE);
        if (cell === 0) {
          ctx.fillStyle = "#FFE8C0";
          ctx.beginPath();
          ctx.arc(px + TILE / 2, py + TILE / 2, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  ghosts.forEach(g => g.draw(ctx));
  pacman.draw(ctx, mouthAngle);
}

// ── Loop principale
function update() {
  if (gameOver) return;

  // Animazione bocca
  mouthAngle += 0.04 * mouthDir;
  if (mouthAngle >= 0.28) mouthDir = -1;
  if (mouthAngle <= 0.02) mouthDir =  1;

  // Muovi Pac-Man
  pacman.tryMove(map);

  // Mangia pallino
  if (map[pacman.y][pacman.x] === 0) {
    map[pacman.y][pacman.x] = 2;
    score += 10;
    scoreEl.textContent = score;
  }

  // Muovi fantasmi
  ghosts.forEach(g => g.move(map));

  // Collisione Pac-Man e fantasma
  for (const g of ghosts) {
    if (g.x === pacman.x && g.y === pacman.y) {
      lives--;
      livesEl.textContent = lives;
      if (lives <= 0) {
        gameOver = true;
        messageEl.textContent = "GAME OVER!";
        draw();
        return;
      }
      messageEl.textContent = "AHI! −1 vita";
      setTimeout(() => { messageEl.textContent = ""; }, 1200);
      pacman = new Pacman(1, 1); // respawn
      return;
    }
  }

  // Vittoria: tutti i pallini mangiati
  if (countDots() === 0) {
    messageEl.textContent = "LIVELLO COMPLETATO! ★";
    gameOver = true;
    draw();
    setTimeout(nextLevel, 1800);
    return;
  }

  draw();
}

window.addEventListener("keydown", e => {
  const keyMap = {
    ArrowUp:    { x:  0, y: -1 },
    ArrowDown:  { x:  0, y:  1 },
    ArrowLeft:  { x: -1, y:  0 },
    ArrowRight: { x:  1, y:  0 },
  };
  if (keyMap[e.key]) {
    pacman.nextDir = keyMap[e.key];
    e.preventDefault();
  }
});

function nextLevel() {
  currentMapIdx = (currentMapIdx + 1) % MAPS.length;
  initLevel();
}

function resetGame() {
  currentMapIdx = 0;
  score = 0;
  lives = 3;
  scoreEl.textContent = score;
  livesEl.textContent = lives;
  initLevel();
}

// ── Avvio livello
initLevel();
setInterval(update, 130);