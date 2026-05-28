const GHOST_COLORS = ["#FF0000", "#22DDFF", "#FFB8FF"];

class Ghost {
  constructor(x, y, color) {
    this.x     = x;
    this.y     = y;
    this.color = color;
    this.dir   = { x: 0, y: 1 };
  }

  draw(ctx) {
    const gx = this.x * TILE;
    const gy = this.y * TILE;
    const w  = TILE;
    const h  = TILE;

    // Sagoma fantasma
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(gx + w / 2, gy + h / 2, w / 2 - 2, Math.PI, 0);
    ctx.lineTo(gx + w - 2, gy + h - 2);

    //denti 
    const teeth = 3;
    const tw = (w - 4) / teeth;
    for (let i = teeth; i >= 0; i--) {
      ctx.lineTo(gx + 2 + tw * i + tw / 2, gy + h - 8);
      ctx.lineTo(gx + 2 + tw * i,           gy + h - 2);
    }
    ctx.lineTo(gx + 2, gy + h / 2);
    ctx.closePath();
    ctx.fill();

    // Occhi bianchi
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(gx + w * 0.32, gy + h * 0.38, 4, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(gx + w * 0.68, gy + h * 0.38, 4, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pupille
    ctx.fillStyle = "#00f";
    ctx.beginPath();
    ctx.arc(gx + w * 0.32 + this.dir.x * 2, gy + h * 0.38 + this.dir.y * 2, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(gx + w * 0.68 + this.dir.x * 2, gy + h * 0.38 + this.dir.y * 2, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  move(map) {
    const dirs = [{ x:1,y:0 }, { x:-1,y:0 }, { x:0,y:1 }, { x:0,y:-1 }];

    // 70% di probabilità di continuare nella stessa direzione
    if (isWalkable(map, this.x + this.dir.x, this.y + this.dir.y) && Math.random() > 0.3) {
      this.x += this.dir.x;
      this.y += this.dir.y;
    } else {
      // Sceglie una direzione percorribile
      const shuffled = [...dirs].sort(() => Math.random() - 0.5);
      for (const d of shuffled) {
        if (isWalkable(map, this.x + d.x, this.y + d.y)) {
          this.dir = d;
          this.x  += d.x;
          this.y  += d.y;
          break;
        }
      }
    }
  }
}
