const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 650;
canvas.height = 650;

class Player {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.step = 25;
    this.isCollision = false;
    document.addEventListener('keydown', e => {
      this.move(e);
    });
  }
  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
  move(e) {
    if (this.isCollision) {
      return;
    }
    switch (e.key) {
      case 'w':
        this.y -= this.step;
        break;
      case 's':
        this.y += this.step;
        break;
      case 'a':
        this.x -= this.step;
        break;
      case 'd':
        this.x += this.step;
        break;
    }
  }
  collision() {
    this.isCollision = true;
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
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.color = '#85C441';
  }
}

class Water extends Block {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.color = '#4C5CA9';
  }
  withCollision(player) {
    if (
      collision(
        {
          x: player.x + player.step,
          y: player.y + player.step,
          w: player.w,
          h: player.h
        },
        { x: this.x, y: this.y, w: this.w, h: this.h }
      )
    ) {
      this.isCollision = true;
      player.collision();
    }
  }
}

const Radi = new Player(200, 600, 50, 50);
const grass1 = new Grass(200, 300, 50, 50);
const water1 = new Water(300, 300, 50, 50);
//player
// let px = 200;
// let py = 600;
// let pw = 50;
// let ph = 50;

const calculate = () => {
  // do something
  water1.withCollision(Radi);
  // if (
  //   collision({ x: px, y: py, w: pw, h: ph }, { x: 200, y: 200, w: 50, h: 50 })
  // ) {
  //   console.log('collision');
  // }
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  printMap();
  Radi.draw();
  grass1.draw();
  water1.draw();
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
  calculate();
  draw();
  window.requestAnimationFrame(loop);
};

const printMap = () => {
  // // water
  // ctx.fillStyle = '#4C5CA9';
  // ctx.fillRect(100, 400, 50, 50);
  // ctx.fillRect(0, 450, 50, 50);
  // ctx.fillRect(0, 550, 50, 50);
  // ctx.fillRect(0, 600, 50, 50);
  // ctx.fillRect(450, 400, 50, 50);
  // ctx.fillRect(500, 400, 50, 50);
  // ctx.fillRect(600, 400, 50, 50);
  // ctx.fillRect(600, 450, 50, 50);
  // ctx.fillRect(600, 500, 50, 50);
  // ctx.fillRect(600, 550, 50, 50);
  // // grass
  // ctx.fillStyle = '#85C441';
  // ctx.fillRect(0, 50, 50, 50);
  // ctx.fillRect(0, 100, 50, 50);
  // ctx.fillRect(0, 150, 50, 50);
  // ctx.fillRect(0, 200, 50, 50);
  // ctx.fillRect(0, 250, 50, 50);
  // ctx.fillRect(50, 250, 50, 50);
  // ctx.fillRect(150, 100, 50, 50);
  // ctx.fillRect(250, 100, 50, 50);
  // ctx.fillRect(200, 100, 50, 50);
  // ctx.fillRect(250, 300, 50, 50);
  // ctx.fillRect(300, 300, 50, 50);
  // ctx.fillRect(200, 350, 50, 50);
  // ctx.fillRect(0, 500, 50, 50);
  // ctx.fillRect(500, 200, 50, 50);
  // ctx.fillRect(500, 250, 50, 50);
  // ctx.fillRect(500, 300, 50, 50);
  // //brick
  // ctx.fillStyle = '#974B22';
  // ctx.fillRect(50, 50, 50, 50);
  // ctx.fillRect(50, 100, 50, 50);
  // ctx.fillRect(0, 300, 50, 50);
  // ctx.fillRect(100, 300, 50, 50);
  // ctx.fillRect(50, 300, 50, 50);
  // ctx.fillRect(150, 150, 50, 50);
  // ctx.fillRect(150, 200, 50, 50);
  // ctx.fillRect(150, 250, 50, 50);
  // ctx.fillRect(150, 300, 50, 50);
  // ctx.fillRect(200, 250, 50, 50);
  // ctx.fillRect(200, 300, 50, 50);
  // ctx.fillRect(250, 250, 50, 50);
  // ctx.fillRect(250, 200, 50, 50);
  // ctx.fillRect(50, 400, 50, 50);
  // ctx.fillRect(50, 450, 50, 50);
  // ctx.fillRect(50, 500, 50, 50);
  // ctx.fillRect(50, 550, 50, 50);
  // ctx.fillRect(50, 600, 50, 50);
  // ctx.fillRect(150, 600, 50, 50);
  // ctx.fillRect(150, 500, 50, 50);
  // ctx.fillRect(150, 450, 50, 50);
  // ctx.fillRect(250, 350, 50, 50);
  // ctx.fillRect(250, 400, 50, 50);
  // ctx.fillRect(250, 450, 50, 50);
  // ctx.fillRect(250, 500, 50, 50);
  // ctx.fillRect(300, 500, 50, 50);
  // ctx.fillRect(350, 500, 50, 50);
  // ctx.fillRect(300, 450, 50, 50);
  // ctx.fillRect(350, 450, 50, 50);
  // ctx.fillRect(350, 400, 50, 50);
  // ctx.fillRect(350, 350, 50, 50);
  // ctx.fillRect(400, 300, 50, 50);
  // ctx.fillRect(450, 300, 50, 50);
  // ctx.fillRect(300, 150, 50, 50);
  // ctx.fillRect(300, 100, 50, 50);
  // ctx.fillRect(350, 100, 50, 50);
  // ctx.fillRect(350, 150, 50, 50);
  // ctx.fillRect(350, 50, 50, 50);
  // ctx.fillRect(450, 250, 50, 50);
  // ctx.fillRect(450, 200, 50, 50);
  // ctx.fillRect(450, 100, 50, 50);
  // ctx.fillRect(450, 50, 50, 50);
  // ctx.fillRect(550, 100, 50, 50);
  // ctx.fillRect(550, 50, 50, 50);
  // ctx.fillRect(550, 200, 50, 50);
  // ctx.fillRect(450, 350, 50, 50);
  // ctx.fillRect(550, 400, 50, 50);
  // ctx.fillRect(550, 350, 50, 50);
  // ctx.fillRect(550, 300, 50, 50);
  // ctx.fillRect(550, 450, 50, 50);
  // ctx.fillRect(450, 450, 50, 50);
  // ctx.fillRect(550, 550, 50, 50);
  // ctx.fillRect(550, 600, 50, 50);
  // ctx.fillRect(500, 600, 50, 50);
  // ctx.fillRect(450, 600, 50, 50);
  // ctx.fillRect(450, 550, 50, 50);
  // //brick
  // ctx.fillStyle = '#ACABAC';
  // ctx.fillRect(150, 0, 50, 50);
  // ctx.fillRect(150, 50, 50, 50);
  // ctx.fillRect(150, 350, 50, 50);
  // ctx.fillRect(150, 400, 50, 50);
  // ctx.fillRect(0, 400, 50, 50);
  // ctx.fillRect(350, 300, 50, 50);
  // ctx.fillRect(400, 250, 50, 50);
  // ctx.fillRect(300, 200, 50, 50);
  // ctx.fillRect(350, 0, 50, 50);
  // ctx.fillRect(450, 150, 50, 50);
  // ctx.fillRect(500, 100, 50, 50);
  // ctx.fillRect(600, 150, 50, 50);
  // ctx.fillRect(600, 200, 50, 50);
  // ctx.fillRect(500, 450, 50, 50);
};

loop();

console.log(canvas);
