class Pacman {
  constructor(x, y) {
    this.x       = x;
    this.y       = y;
    this.dir     = { x: 1, y: 0 };  // direzione corrente
    this.nextDir = { x: 1, y: 0 };  // prossima direzione richiesta 
  }

  draw(ctx, mouthAngle) {
    const cx = this.x * TILE + TILE / 2;
    const cy = this.y * TILE + TILE / 2;
    const r  = TILE * 0.42;

    // Rotazione in base alla direzione
    let rot = 0;
    if (this.dir.x ===  1) rot = 0;
    if (this.dir.x === -1) rot = Math.PI;
    if (this.dir.y === -1) rot = -Math.PI / 2;
    if (this.dir.y ===  1) rot =  Math.PI / 2;

    const mouth = mouthAngle * Math.PI;

    // Corpo giallo
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, rot + mouth, rot + Math.PI * 2 - mouth);
    ctx.closePath();
    ctx.fill();

    // Occhio
    const eyeX = cx + Math.cos(rot - Math.PI / 2) * r * 0.45;
    const eyeY = cy + Math.sin(rot - Math.PI / 2) * r * 0.45;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, r * 0.13, 0, Math.PI * 2);
    ctx.fill();
  }

  tryMove(map) {
    // Prova la direzione desiderata dal giocatore
    const nx = this.x + this.nextDir.x;
    const ny = this.y + this.nextDir.y;
    if (isWalkable(map, nx, ny)) {
      this.dir = { ...this.nextDir };
    }

    // Avanza nella direzione corrente
    const mx = this.x + this.dir.x;
    const my = this.y + this.dir.y;
    if (isWalkable(map, mx, my)) {
      this.x = mx;
      this.y = my;
    }
  }
}
