class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // normalize
    this.canvas.width = 650;
    this.canvas.height = 650;

    // map
    this.grasses = [];
    this.metals = [];
    this.bricks = [];
    this.waters = [];
    this.bullets = [];
    this.createMaterials();

    // players
    this.player1 = new Player({ ctx: this.ctx, x: 200, y: 600, game: this });
    this.enemy1 = new Enemy({ ctx: this.ctx, x: 300, y: 400, game: this });

    // loop
    this.loop();
  }

  update() {
    this.player1.update();
    this.enemy1.update();
    this.metals.map(elem => this.player1.collision(elem));
    this.bricks.map(elem => this.player1.collision(elem));
    this.waters.map(elem => this.player1.collision(elem));

    this.bricks.map(elem => this.enemy1.collision(elem));
    this.metals.map(elem => this.enemy1.collision(elem));

    this.bullets.map(elem => elem.go());

    this.bullets.map((elemB, i) => {
      this.metals.map(elem => elemB.collision(elem));
      this.bricks.map(elem => elemB.collision(elem));
      elemB.collisionInside();
      if (elemB.isCollisionB) {
        this.bullets.splice(i, 1);
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player1.draw();
    this.metals.map(elem => elem.draw());
    this.bricks.map(elem => elem.draw());
    this.waters.map(elem => elem.draw());
    this.bullets.map(elem => elem.draw());
    this.enemy1.draw();
    this.grasses.map(elem => elem.draw());
  }

  loop() {
    new FpsController(() => {
      this.update();
    }, 1000);
    new FpsController(() => {
      this.draw();
    }, 1000);
  }

  createMaterials() {
    grassesPosition.map(elem =>
      this.grasses.push(new Grass({ ctx: this.ctx, ...elem }))
    );
    metalsPosition.map(elem =>
      this.metals.push(new Metal({ ctx: this.ctx, ...elem }))
    );
    bricksPosition.map(elem =>
      this.bricks.push(new Brick({ ctx: this.ctx, ...elem }))
    );
    watersPosition.map(elem =>
      this.waters.push(new Water({ ctx: this.ctx, ...elem }))
    );
  }
}

class FpsController {
  constructor(cbf, fps) {
    this.cbf = cbf;
    this.fps = fps;
    this.then = Date.now();
    this.interval = 1000;
    this.animate();
  }

  animate() {
    this.now = Date.now();
    this.different = this.now - this.then;
    if (this.different > this.interval / this.fps) {
      this.cbf();
      this.then = this.now;
    }
    window.requestAnimationFrame(() => {
      this.animate();
    });
  }
}

class Entity {
  constructor({ ctx, x, y, w, h }) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = '#fff';
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

class Tank extends Entity {
  constructor({ game, ...initialArguments }) {
    super({ ...initialArguments, w: 50, h: 50 });
    this.dx = this.x;
    this.dy = this.y;
    this.step = 1.5;
    this.isDirection = 1;
    this.isMove = [];
    this.isShot = false;
    this.isCollision = false;
    this.game = game;

    // direction
    this.posX = this.w / 2;
    this.posY = this.h / 2;
    this.angle = 0;

    // animation
    this.currentFrame = 0;
    this.columns = 2;
    this.delay = 5;
    this.count = 0;
  }

  draw() {
    this.ctx.imageSmoothingEnabled = false;

    this.ctx.translate(this.posX + this.x, this.y + this.posY);
    this.ctx.rotate(this.angle);
    this.ctx.scale(-1, 1);
    this.ctx.drawImage(
      this.image,
      16 * this.currentFrame,
      0,
      16,
      16,
      -this.posX,
      -this.posY,
      this.w,
      this.h
    );
    this.ctx.scale(-1, 1);
    this.ctx.rotate(-this.angle);
    this.ctx.translate(-this.posX - this.x, -this.y - this.posY);
  }
  shot() {
    if (this.isShot) {
      this.game.bullets.push(new Bullet(this));
      setTimeout(() => {
        this.isShot = false;
      }, 1000);
    }
  }

  collision(block) {
    if (
      this.dx + this.w > block.x &&
      this.dx < block.x + block.w &&
      this.dy + this.h > block.y &&
      this.dy < block.y + block.h
    ) {
      this.isCollision = true;
    }
  }

  collisionInside() {
    if (
      this.dx + this.w > 650 ||
      this.dx < 0 ||
      this.dy + this.h > 650 ||
      this.dy < 0
    ) {
      this.isCollision = true;
    }
  }
}

class Player extends Tank {
  constructor(initialArguments) {
    super(initialArguments);
    // this.game = game;
    this.image = new Image();
    this.image.src = './img/tank_yellow.png';

    // events
    document.addEventListener('keydown', e => {
      this.actions(e);
    });
    document.addEventListener('keyup', e => {
      this.reset(e);
    });
  }

  update() {
    this.count++;
    this.count = this.count % this.delay;

    // change frame
    if (this.count === 0 && this.isMove.length !== 0) {
      this.currentFrame++;
      this.currentFrame = this.currentFrame % 2;
    }
    switch (this.isMove[this.isMove.length - 1]) {
      case 'w':
        this.isDirection = 1;
        this.angle = 0 * (Math.PI / 180);
        break;
      case 's':
        this.isDirection = 2;
        this.angle = 180 * (Math.PI / 180);
        break;
      case 'a':
        this.isDirection = 3;
        this.angle = 270 * (Math.PI / 180);
        break;
      case 'd':
        this.isDirection = 4;
        this.angle = 90 * (Math.PI / 180);
        break;
    }

    if (!this.isCollision) {
      this.x = this.dx;
      this.y = this.dy;
    }

    this.move();
    this.collisionInside();
  }

  actions(e) {
    const key = e.key.toLowerCase();
    if (key === 'w' || key === 's' || key === 'a' || key === 'd') {
      !this.isMove.includes(key) && this.isMove.push(key);
    }
    if (key === 't') {
      if (this.isShot) return;
      this.isShot = true;
      this.shot();
    }
  }
  reset(e) {
    this.isMove = this.isMove.filter(letter => letter !== e.key.toLowerCase());
    this.isCollision = false;
    this.dx = this.x;
    this.dy = this.y;
  }
  move() {
    if (this.isMove.length === 0) return;
    else {
      this.recalculate(this.isDirection);
      if (this.isDirection === 1) {
        this.dy = this.y - this.step;
      }

      if (this.isDirection === 2) {
        this.dy = this.y + this.step;
      }

      if (this.isDirection === 3) {
        this.dx = this.x - this.step;
      }

      if (this.isDirection === 4) {
        this.dx = this.x + this.step;
      }
    }
  }

  recalculate(exy) {
    if (exy == 1 || exy == 2) {
      let rx = Math.trunc(this.x / 100) * 100;
      let rxa = Math.trunc(this.x / 10) * 10;
      if (rxa >= rx + 50) rx = rx + 50;
      if (rx <= this.x && this.x < rx + 15) this.dx = rx;
      if (rx + 15 <= this.x && this.x <= rx + 35) this.dx = rx + 25;
      if (rx + 35 < this.x && this.x < this.x + 50) this.dx = rx + 50;
    }

    if (exy == 3 || exy == 4) {
      let ry = Math.trunc(this.y / 100) * 100;
      let rya = Math.trunc(this.y / 10) * 10;
      if (rya >= ry + 50) ry = ry + 50;
      if (ry <= this.y && this.y < ry + 18) this.dy = ry;
      if (ry + 18 <= this.y && this.y <= ry + 33) this.dy = ry + 25;
      if (ry + 33 < this.y && this.y < this.y + 50) this.dy = ry + 50;
    }
  }
}

class Enemy extends Tank {
  constructor(initialArguments) {
    super(initialArguments);
    this.image = new Image();
    this.image.src = './img/tank2.png';
    this.isDirection = 2;
    this.step = 1;
    this.directionFail = 0;
    setInterval(() => {
      this.isDirection = Math.floor(Math.random() * 4) + 1;
    }, 2000);
    setInterval(() => {
      this.isShot = true;
      this.shot();
    }, 2000);
  }
  update() {
    this.count++;
    this.count = this.count % this.delay;
    console.log(this.isDirection);
    // change frame
    if (this.count === 0 && this.isMove.length !== 0) {
      this.currentFrame++;
      this.currentFrame = this.currentFrame % 2;
    }
    switch (this.isDirection) {
      case 1:
        this.angle = 0 * (Math.PI / 180);
        if (this.y % 100 == 0) {
          this.isDirection = Math.floor(Math.random() * 4) + 1;
        }
        break;
      case 2:
        this.angle = 180 * (Math.PI / 180);
        if (this.y % 100 == 0) {
          this.isDirection = Math.floor(Math.random() * 4) + 1;
        }
        //

        break;
      case 3:
        this.angle = 270 * (Math.PI / 180);
        if (this.x % 100 == 0) {
          this.isDirection = Math.floor(Math.random() * 4) + 1;
        }
        break;
      case 4:
        this.angle = 90 * (Math.PI / 180);
        if (this.x % 100 == 0) {
          this.isDirection = Math.floor(Math.random() * 4) + 1;
        }
        break;
    }
    if (!this.isCollision) {
      this.x = this.dx;
      this.y = this.dy;
    } else {
      this.reset();
    }

    this.move();
    this.collisionInside();
  }
  reset() {
    // let directionRandom = Math.floor(Math.random() * 4) + 1;
    // while (this.isDirection === directionRandom) {
    //   directionRandom = Math.floor(Math.random() * 4) + 1;
    // }
    // this.isDirection = directionRandom;
    this.isCollision = false;
    this.dx = this.x;
    this.dy = this.y;
  }
  move() {
    if (this.isCollision) return;
    else {
      if (this.isDirection === 1) {
        this.dy = this.y - this.step;
      }
      if (this.isDirection === 2) {
        this.dy = this.y + this.step;
      }
      if (this.isDirection === 3) {
        this.dx = this.x - this.step;
      }

      if (this.isDirection === 4) {
        this.dx = this.x + this.step;
      }
    }
  }
}

class Bullet extends Entity {
  constructor(player) {
    super({
      ctx: player.game.ctx,
      x: player.x + 50 / 2 - 5,
      y: player.y + 50 / 2 - 5,
      w: 10,
      h: 10
    });
    this.direction = player.isDirection;
    this.color = '#fff';
    this.isCollisionB = false;
    this.speedBullet = 4;
    this.dx = this.x;
    this.dy = this.y;
  }
  go() {
    if (this.isCollisionB) return;
    if (this.direction == 1) {
      this.y -= this.speedBullet;
    }
    if (this.direction == 2) {
      this.y += this.speedBullet;
    }
    if (this.direction == 3) {
      this.x -= this.speedBullet;
    }
    if (this.direction == 4) {
      this.x += this.speedBullet;
    }
  }

  collision(block) {
    if (
      this.x + this.w > block.x &&
      this.x < block.x + block.w &&
      this.y + this.h > block.y &&
      this.y < block.y + block.h
    ) {
      this.isCollisionB = true;
      this.dx = this.x;
      this.dy = this.y;
    }
  }

  collisionInside() {
    if (
      this.x + this.w > 650 ||
      this.x < 0 ||
      this.y + this.h > 650 ||
      this.y < 0
    ) {
      this.isCollisionB = true;
    }
  }
}

class Block extends Entity {
  constructor(initialArguments) {
    super(initialArguments);
    this.image = new Image();
  }

  draw() {
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.drawImage(
      this.image,
      0,
      0,
      16,
      16,
      this.x,
      this.y,
      this.w,
      this.h
    );
  }
}

class Grass extends Block {
  constructor(initialArguments) {
    super(initialArguments);
    this.color = '#85C441';
    this.image.src = './img/grass.png';
  }
}

class Metal extends Block {
  constructor(initialArguments) {
    super(initialArguments);
    this.color = '#ACABAC';
    this.image.src = './img/metal.png';
  }
}

class Brick extends Block {
  constructor(initialArguments) {
    super(initialArguments);
    this.color = '#974B22';
    this.image.src = './img/brick.png';
  }
}

class Water extends Block {
  constructor(initialArguments) {
    super(initialArguments);
    this.color = '#4C5CA9';
    this.image.src = './img/water.png';
  }
}
