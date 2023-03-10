const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 650;
canvas.height = 650;
let bullets = [];

class Player {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.vx = x;
    this.vy = y;
    this.w = w;
    this.h = h;
    this.step = 5;
    this.isCollision = false;
    this.upDown = false;
    document.addEventListener('keydown', e => {
      this.actions(e);
    });
    document.addEventListener('keyup', e => {
      this.reset();
    });
  }
  draw() {
    if (!this.isCollision) {
      this.x = this.vx;
      this.y = this.vy;
    }
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
  actions(e) {
    if (e.key === 'w' || e.key === 's' || e.key === 'a' || e.key === 'd') {
      this.move(e);
    }
    if (e.key === 't') {
      this.shot();
    }
  }
  move(e) {
    if (e.key === 'w' || e.key === 's') {
      this.upDown = true;
    } else {
      this.upDown = false;
    }
    let rx = Math.trunc(this.x / 100) * 100;
    let rxa = Math.trunc(this.x / 10) * 10;
    if (rxa >= rx + 50) rx = rx + 50;

    let ry = Math.trunc(this.y / 100) * 100;
    let rya = Math.trunc(this.y / 10) * 10;
    if (rya >= ry + 50) ry = ry + 50;
    if (this.upDown) {
      if (e.key == 'w') {
        if (rx <= this.x && this.x < rx + 15) this.vx = rx;
        if (rx + 15 <= this.x && this.x <= rx + 35) this.vx = rx + 25;
        if (rx + 35 < this.x && this.x < this.x + 50) this.vx = rx + 50;
        this.vy = this.y - this.step;
      }
      if (e.key == 's') {
        if (rx <= this.x && this.x < rx + 15) this.vx = rx;
        if (rx + 15 <= this.x && this.x <= rx + 35) this.vx = rx + 25;
        if (rx + 35 < this.x && this.x < this.x + 50) this.vx = rx + 50;
        this.vy = this.y + this.step;
      }
    } else {
      if (e.key == 'a') {
        if (ry <= this.y && this.y < ry + 15) this.vy = ry;
        if (ry + 15 <= this.y && this.y <= ry + 35) this.vy = ry + 25;
        if (ry + 35 < this.y && this.y < this.y + 50) this.vy = ry + 50;
        this.vx = this.x - this.step;
      }
      if (e.key == 'd') {
        if (ry <= this.y && this.y <= ry + 15) this.vy = ry;
        if (ry + 15 <= this.y && this.y <= ry + 35) this.vy = ry + 25;
        if (ry + 35 < this.y && this.y < this.y + 50) this.vy = ry + 50;
        this.vx = this.x + this.step;
      }
    }
  }
  shot() {
    bullets.push(new Bullet(this));
  }
  collision(block) {
    if (collision({ x: this.vx, y: this.vy, w: this.w, h: this.h }, block)) {
      this.isCollision = true;
    }
  }
  exit() {
    if (
      this.vx + this.w > canvas.width ||
      this.vx < 0 ||
      this.vy + this.h > canvas.height ||
      this.vy < 0
    ) {
      this.isCollision = true;
    }
  }
  reset() {
    this.isCollision = false;
    this.vx = this.x;
    this.vy = this.y;
  }
}

class Bullet {
  constructor(player) {
    this.x = player.x + player.w / 2 - 5;
    this.y = player.y + player.h / 2 - 5;
    this.w = 10;
    this.h = 10;
    this.color = '#fff';
    this.isCollision = false;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
  go() {
    if (direction == 1) {
      this.y -= 2;
    }
    if (direction == 2) {
      this.y -= 2;
    }
    if (direction == 1) {
      this.y -= 2;
    }
    if (direction == 1) {
      this.y -= 2;
    }
  }
}

class Block {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = '#fff';
    this.isCollision = false;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

class Grass extends Block {
  constructor({ x, y, w, h }) {
    super(x, y, w, h);
    this.color = '#85C441';
  }
}

class Water extends Block {
  constructor({ x, y, w, h }) {
    super(x, y, w, h);
    this.color = '#4C5CA9';
  }
}

class Metal extends Block {
  constructor({ x, y, w, h }) {
    super(x, y, w, h);
    this.color = '#ACABAC';
  }
}

class Brick extends Block {
  constructor({ x, y, w, h }) {
    super(x, y, w, h);
    this.color = '#974B22';
  }
}

let waters = [];
for (let i = 0; i < watersPosition.length; i++) {
  waters.push(new Water(watersPosition[i]));
}

let bricks = [];
for (let i = 0; i < bricksPosition.length; i++) {
  bricks.push(new Brick(bricksPosition[i]));
}

let metals = [];
for (let i = 0; i < metalsPosition.length; i++) {
  metals.push(new Metal(metalsPosition[i]));
}

let grasses = [];
for (let i = 0; i < grassesPosition.length; i++) {
  grasses.push(new Grass(grassesPosition[i]));
}

const Radi = new Player(200, 600, 50, 50);

const update = () => {
  Radi.exit();
  waters.map(elem => Radi.collision(elem));
  bricks.map(elem => Radi.collision(elem));
  metals.map(elem => Radi.collision(elem));
  bullets.map(elem => elem.go());
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Radi.draw();
  waters.map(elem => elem.draw());
  bricks.map(elem => elem.draw());
  bullets.map(elem => elem.draw());
  grasses.map(elem => elem.draw());
  metals.map(elem => elem.draw());
};

const collision = (obj1, obj2) => {
  let collision = false;
  if (
    obj1.x + obj1.w > obj2.x &&
    obj1.x < obj2.x + obj2.w &&
    obj1.y + obj1.h > obj2.y &&
    obj1.y < obj2.y + obj2.h
  ) {
    collision = true;
  }
  return collision;
};
const loop = () => {
  update();
  draw();
  window.requestAnimationFrame(loop);
};

loop();
