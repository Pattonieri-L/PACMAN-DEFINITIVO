class Ghost {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x * TILE_SIZE + 20, this.y * TILE_SIZE + 20, 15, Math.PI, 0);
        ctx.lineTo(this.x * TILE_SIZE + 35, this.y * TILE_SIZE + 35);
        ctx.lineTo(this.x * TILE_SIZE + 5, this.y * TILE_SIZE + 35);
        ctx.fill();
    }

    move(map) {
        const dirs = [{x:1, y:0}, {x:-1, y:0}, {x:0, y:1}, {x:0, y:-1}];
        let randomDir = dirs[Math.floor(Math.random() * dirs.length)];
        
        if (map[this.y + randomDir.y][this.x + randomDir.x] !== 1) {
            this.x += randomDir.x;
            this.y += randomDir.y;
        }
    }
}