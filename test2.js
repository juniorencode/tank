class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // normalize
    this.tile = 50;
    this.columns = 25;
    this.rows = 20;
    this.canvas.width = this.tile * this.columns;
    this.canvas.height = this.tile * this.rows;

    // map
    this.grasses = [];
    this.metals = [];
    this.bricks = [];
    this.waters = [];
    this.bullets = [];

    // object default
    this.public = {
      ctx: this.ctx,
      tile: this.tile,
      columns: this.columns,
      rows: this.rows,
      createBullet: pos => {
        this.createBullet(pos);
      }
    };

    // players
    this.player1 = new Player({
      game: this.public,
      x: 200,
      y: 600
    });

    // begin function
    this.createMaterials();

    // loop
    this.loop();
  }

  createBullet(data) {
    this.bullets.push(
      new Bullet({
        game: this.public,
        x: data.x,
        y: data.y,
        direction: data.direction
      })
    );
  }

  update() {
    this.player1.update();
    // this.metals.map(elem => this.player1.collision(elem));
    this.bricks.map(elem => this.player1.collision(elem));
    // this.waters.map(elem => this.player1.collision(elem));

    this.bullets.map(elem => elem.go());

    this.bullets.map((elem, i) => {
      elem.collisionInside();
      // this.metals.map(elem => elem.collision(elem));
      this.bricks.map((block, i) => {
        const collision = elem.collision(block);
        if (collision) {
          // this.bullets.splice(i, 1);
          console.log(elem);
          const destroyed = block.damage(elem);
          destroyed && this.bricks.splice(i, 1);
        }
      });

      if (elem.isCollision) {
        this.bullets.splice(i, 1);
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player1.draw();
    // this.metals.map(elem => elem.draw());
    this.bricks.map(elem => elem.draw());
    // this.waters.map(elem => elem.draw());
    this.bullets.map(elem => elem.draw());
    // this.grasses.map(elem => elem.draw());
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
      this.grasses.push(new Grass({ game: this.public, ...elem }))
    );
    metalsPosition.map(elem =>
      this.metals.push(new Metal({ game: this.public, ...elem }))
    );
    bricksPosition.map(elem =>
      this.bricks.push(new Brick({ game: this.public, ...elem }))
    );
    watersPosition.map(elem =>
      this.waters.push(new Water({ game: this.public, ...elem }))
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
  constructor({ game, x, y, w, h }) {
    this.game = game;
    this.ctx = game.ctx;
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

class Player extends Entity {
  constructor(initialArguments) {
    super({ ...initialArguments, w: 50, h: 50 });
    this.dx = this.x;
    this.dy = this.y;
    this.step = 1.5;
    this.isDirection = 1;
    this.isMove = [];
    this.isShot = false;
    this.isCollision = false;
    this.color = 'red';
    this.image = new Image();
    this.image.src = './img/tank_yellow.png';

    // direction
    this.posX = this.w / 2;
    this.posY = this.h / 2;
    this.angle = 0;

    // animation
    this.currentFrame = 0;
    this.columns = 2;
    this.delay = 5;
    this.count = 0;

    // events
    document.addEventListener('keydown', e => {
      this.actions(e);
    });
    document.addEventListener('keyup', e => {
      this.reset(e);
    });
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

  update() {
    this.count++;
    this.count = this.count % this.delay;

    // change frame
    if (this.count == 0 && this.isMove.length != 0) {
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
      if (ry + 18 <= this.y && this.y <= ry + 33) {
        console.log('Here..!!');
        this.dy = ry + 25;
      }
      if (ry + 33 < this.y && this.y < this.y + 50) this.dy = ry + 50;
    }
  }

  shot() {
    if (this.isShot) {
      // this.game.bullets.push(new Bullet(this));
      this.game.createBullet({
        x: this.x,
        y: this.y,
        direction: this.isDirection
      });
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

  reset(e) {
    this.isMove = this.isMove.filter(letter => letter !== e.key.toLowerCase());
    this.isCollision = false;
    this.dx = this.x;
    this.dy = this.y;
  }

  collisionInside() {
    if (
      this.dx + this.w > this.ctx.canvas.width ||
      this.dx < 0 ||
      this.dy + this.h > this.ctx.canvas.height ||
      this.dy < 0
    ) {
      this.isCollision = true;
    }
  }
}

class Bullet extends Entity {
  constructor({ direction, ...initialArguments }) {
    super({
      ...initialArguments,
      w: 10,
      h: 10
    });
    this.x = this.x + this.game.tile / 2 - this.w / 2;
    this.y = this.y + this.game.tile / 2 - this.h / 2;
    this.direction = direction;
    this.isCollision = false;
    this.speedBullet = 4;
    this.dx = this.x;
    this.dy = this.y;
  }
  go() {
    if (this.isCollision) return;
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
      this.isCollision = true;
      this.dx = this.x;
      this.dy = this.y;
      return true;
    }
  }

  collisionInside() {
    if (
      this.x + this.w > this.ctx.canvas.width ||
      this.x < 0 ||
      this.y + this.h > this.ctx.canvas.height ||
      this.y < 0
    ) {
      this.isCollision = true;
    }
  }
}

class Block extends Entity {
  constructor(initialArguments) {
    super(initialArguments);
    this.image = new Image();
    this.sprite = 16;
    this.constant = this.sprite / this.game.tile;
    this.destroyed = false;
    this.image.onload = () => {
      this.pCanvas = document.createElement('canvas');
      this.pCanvas.width = this.game.tile;
      this.pCanvas.height = this.game.tile;
      const pCtx = this.pCanvas.getContext('2d');
      pCtx.imageSmoothingEnabled = false;
      pCtx.drawImage(
        this.image,
        0,
        0,
        this.sprite,
        this.sprite,
        0,
        0,
        this.game.tile,
        this.game.tile
      );
      // console.log(this.tile);
      this.pattern = this.ctx.createPattern(this.pCanvas, 'repeat');
    };
  }

  draw() {
    this.ctx.fillStyle = this.pattern;
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  damage(bullet) {
    // this.h = bullet.direction === 1 && this.h - this.game.tile / 4;
    switch (bullet.direction) {
      case 1:
        this.h = this.h - this.game.tile / 4;
        break;
      case 2:
        this.y = this.y + this.game.tile / 4;
        this.h = this.h - this.game.tile / 4;
        break;
      case 3:
        this.w = this.w - this.game.tile / 4;
        break;
      case 4:
        this.x = this.x + this.game.tile / 4;
        this.w = this.w - this.game.tile / 4;
        break;
    }
    if (this.w <= 0 || this.h <= 0) {
      this.destroyed = true;
      return true;
    }
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
