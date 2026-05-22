class Pacman {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dir = {x: 0, y: 0};
    }

    draw(ctx) {
        const centerX = this.x * TILE_SIZE + TILE_SIZE / 2;
        const centerY = this.y * TILE_SIZE + TILE_SIZE / 2;
        const radius = TILE_SIZE * 0.4;

        // --- Disegna il corpo giallo ---
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        // Calcola l'angolo della bocca basato sulla direzione (semplificato)
        let startAngle = 0.2 * Math.PI;
        let endAngle = 1.8 * Math.PI;
        
        // Ruota la bocca in base alla direzione
        let rotation = 0;
        if(this.dir.x === 1) rotation = 0;          // Destra
        if(this.dir.x === -1) rotation = Math.PI;   // Sinistra
        if(this.dir.y === -1) rotation = -Math.PI/2;// Su
        if(this.dir.y === 1) rotation = Math.PI/2;  // Giù

        ctx.arc(centerX, centerY, radius, startAngle + rotation, endAngle + rotation);
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        //  Disegna l'OCCHIO 
        ctx.fillStyle = "black";
        ctx.beginPath();
        
        // Posizione base dell'occhio (sopra il centro)
        let eyeX = centerX;
        let eyeY = centerY - (radius * 0.5);
    }

    move(map) {
        let newX = this.x + this.dir.x;
        let newY = this.y + this.dir.y;

        // Controllo bordi array e muri
        if (map[newY] && map[newY][newX] !== undefined && map[newY][newX] !== 1) {
            this.x = newX;
            this.y = newY;
            return true;
        }
        return false;
    }
}