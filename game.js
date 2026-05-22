const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

let currentMapIdx = 0;
let score = 0;
let map;
let pacman;
let ghosts;

// Funzione per inizializzare o resettare il livello
function initLevel() {
    // Clona la mappa originale
    map = JSON.parse(JSON.stringify(MAPS[currentMapIdx]));
    
    // Adatta il Canvas alla nuova mappa
    canvas.width = map[0].length * TILE_SIZE;
    canvas.height = map.length * TILE_SIZE;
    
    // Posiziona Pac-Man (sempre a 1,1)
    pacman = new Pacman(1, 1);
    
    // Posiziona i 2 fantasmi in angoli lontani in base alla mappa
    const maxY = map.length - 2;
    const maxX = map[0].length - 2;
    ghosts = [
        new Ghost(maxX, 1, "red"),     // Angolo alto a destra
        new Ghost(maxX, maxY, "cyan")   // Angolo basso a destra
    ];
    
    draw(); // Primo disegno 
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Disegna Mappa
    for(let y=0; y<map.length; y++) {
        for(let x=0; x<map[y].length; x++) {
            if(map[y][x] === 1) {
                // Muri blu scuro
                ctx.fillStyle = "#1919A6"; 
                ctx.fillRect(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else if(map[y][x] === 0) {
                // Puntini bianchi piccoli
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.arc(x*TILE_SIZE + TILE_SIZE/2, y*TILE_SIZE + TILE_SIZE/2, 3, 0, Math.PI*2);
                ctx.fill();
            }
        }
    }

    pacman.draw(ctx);
    ghosts.forEach(g => g.draw(ctx));
}

function update() {
    pacman.move(map);
    
    // Mangia puntini
    if(map[pacman.y][pacman.x] === 0) {
        map[pacman.y][pacman.x] = 2; // Spazio vuoto
        score += 10;
        scoreElement.innerText = score;
    }

    // Muovi fantasmi e controlla collisioni
    ghosts.forEach(g => {
        g.move(map);
        // Collisione grossolana (stessa cella)
        if(g.x === pacman.x && g.y === pacman.y) {
            alert("GAME OVER! Punti: " + score);
            score = 0;
            scoreElement.innerText = score;
            currentMapIdx = 0;
            initLevel();
        }
    });

    draw();
}

function nextLevel() {
    currentMapIdx = (currentMapIdx + 1) % MAPS.length;
    initLevel();
}


window.addEventListener("keydown", e => {
    if(e.key === "ArrowUp")    pacman.dir = {x:0, y:-1};
    if(e.key === "ArrowDown")  pacman.dir = {x:0, y:1};
    if(e.key === "ArrowLeft")  pacman.dir = {x:-1, y:0};
    if(e.key === "ArrowRight") pacman.dir = {x:1, y:0};
    // Previene lo scroll della pagina con le frecce
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }
});

// Avvia il gioco
initLevel();
setInterval(update, 150); // Leggermente più veloce