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
    this.players = [];
    this.enemies = [];
    this.createMaterials();

    // players
    this.playersN = 2;
    for (let i = 0; i < this.playersN; i++) {
      this.players.push(
        new Player({ ctx: this.ctx, game: this, ...playersPosition[i] })
      );
      this.players[i].playerC(i + 1);
    }

    // enemies
    this.enemiesN = 3;
    for (let i = 0; i < this.enemiesN; i++) {
      this.enemies.push(
        new Enemy({ ctx: this.ctx, game: this, ...enemiesPosition[i] })
      );
    }
    // loop
    this.loop();
  }

  update() {
    this.bullets.map((elemB, i) => {
      elemB.go();
      this.players.map(elem => elemB.collision(elem));
      this.metals.map(elem => elemB.collision(elem));
      this.bricks.map(elem => elemB.collision(elem));

      this.enemies.map(elem => elemB.collision(elem));
      this.bullets.map((elem, j) => i !== j && elemB.collision(elem));

      elemB.collisionInside();
      if (elemB.isCollisionB) {
        this.bullets.splice(i, 1);
      }
    });

    this.players.map((elemB, i) => {
      elemB.update();

      this.players.map((elem, j) => i !== j && elemB.collision(elem));
      this.enemies.map(elem => {
        elemB.collision(elem);
        elem.collision(elemB);
      });
      this.metals.map(elem => elemB.collision(elem));
      // this.bricks.map(elem => elemB.collision(elem));
      this.waters.map(elem => elemB.collision(elem));
      if (elemB.isCollisionB) {
        const live = elemB.dead();
        if (live) {
          this.players.splice(i, 1);
        }
      }
    });
    this.enemies.map((elemB, i) => {
      elemB.update();

      this.enemies.map((elem, j) => i !== j && elemB.collision(elem));
      this.players.map(elem => {
        elemB.collision(elem);
        elem.collision(elemB);
      });
      this.metals.map(elem => elemB.collision(elem));
      this.bricks.map(elem => elemB.collision(elem));
      this.waters.map(elem => elemB.collision(elem));
      if (elemB.isCollisionB) {
        const live = elemB.dead();
        if (live) {
          clearInterval(elemB.interval);
          this.enemies.splice(i, 1);
        }
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.players.map(elem => elem.draw());
    this.metals.map(elem => elem.draw());
    this.bricks.map(elem => elem.draw());
    this.waters.map(elem => elem.draw());
    this.bullets.map(elem => elem.draw());
    this.enemies.map(elem => elem.draw());
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
    this.step = 1;
    this.isDirection = 1;
    this.isMove = [];
    this.isShot = false;
    this.isCollision = false;
    this.game = game;
    this.isCollisionB = false;
    this.initialX = this.x;
    this.initialY = this.y;

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
  dead() {
    if (this.life > 0) {
      this.life--;
      this.dx = this.initialX;
      this.dy = this.initialY;
      this.isCollisionB = false;
      return false;
    } else {
      return true;
    }
  }
}

class Player extends Tank {
  constructor(initialArguments) {
    super(initialArguments);
    // this.game = game;
    this.life = 3;
    this.image = new Image();
    this.image.src = './img/tank_yellow.png';
    this.playerN = 2;

    // events
    document.addEventListener('keydown', e => {
      this.actions(e);
    });
    document.addEventListener('keyup', e => {
      this.reset(e);
    });
  }
  playerC(indexPlayer) {
    this.playerN = indexPlayer;
  }
  update() {
    if (this.life > 0) {
      this.count++;
      this.count = this.count % this.delay;

      // change frame
      if (this.count === 0 && this.isMove.length !== 0) {
        this.currentFrame++;
        this.currentFrame = this.currentFrame % 2;
      }

      this.controls();

      if (!this.isCollision) {
        this.x = this.dx;
        this.y = this.dy;
      }

      this.move();
      this.collisionInside();
    }
  }
  controls() {
    if (this.playerN === 1) {
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
    }
    if (this.playerN === 2) {
      switch (this.isMove[this.isMove.length - 1]) {
        case 'arrowup':
          this.isDirection = 1;
          this.angle = 0 * (Math.PI / 180);
          break;
        case 'arrowdown':
          this.isDirection = 2;
          this.angle = 180 * (Math.PI / 180);
          break;
        case 'arrowleft':
          this.isDirection = 3;
          this.angle = 270 * (Math.PI / 180);
          break;
        case 'arrowright':
          this.isDirection = 4;
          this.angle = 90 * (Math.PI / 180);
          break;
      }
    }
  }
  actions(e) {
    if (this.life > 0) {
      const key = e.key.toLowerCase();
      if (this.playerN === 1) {
        if (key === 'w' || key === 's' || key === 'a' || key === 'd') {
          if (!this.isMove.includes(key)) {
            this.isMove.push(key);
            this.isCollision = false;
            this.dx = this.x;
            this.dy = this.y;
          }
        }
        if (key === 't') {
          if (this.isShot) return;
          this.isShot = true;
          this.shot();
        }
      }
      if (this.playerN === 2) {
        if (
          key === 'arrowup' ||
          key === 'arrowdown' ||
          key === 'arrowleft' ||
          key === 'arrowright'
        ) {
          if (!this.isMove.includes(key)) {
            this.isMove.push(key);
            this.isCollision = false;
            this.dx = this.x;
            this.dy = this.y;
          }
        }
        if (key === 'p') {
          if (this.isShot) return;
          this.isShot = true;
          this.shot();
        }
      }
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
      this.recalculate(this.isDirection);
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
    this.life = 2;
    this.interval = setInterval(() => {
      this.isShot = true;
      this.shot();
    }, 1000);
  }
  update() {
    this.count++;
    this.count = this.count % this.delay;

    // change frame
    if (this.count === 0) {
      this.currentFrame++;
      this.currentFrame = this.currentFrame % 2;
    }
    if (!this.isCollision) {
      this.x = this.dx;
      this.y = this.dy;
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
    } else {
      this.reset();
    }

    this.move();
    this.collisionInside();
  }
  reset() {
    let directionRandom = Math.floor(Math.random() * 4) + 1;
    // while (this.isDirection === directionRandom) {
    //   directionRandom = Math.floor(Math.random() * 4) + 1;
    // }
    this.isDirection = directionRandom;
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
    this.owner = player;
    this.victim = null;
    if (this.direction == 1) {
      this.y -= 28;
    }
    if (this.direction == 2) {
      this.y += 28;
    }
    if (this.direction == 3) {
      this.x -= 28;
    }
    if (this.direction == 4) {
      this.x += 28;
    }
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
      if (this.owner.constructor.name != block.constructor.name) {
        this.isCollisionB = true;
        block.isCollisionB = true;
        this.victim = block;
      }
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
