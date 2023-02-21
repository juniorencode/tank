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
    this.createMaterials();

    // players
    this.player1 = new Player({ ctx: this.ctx, x: 200, y: 600 });

    // loop
    this.then = Date.now();
    this.interval = 1000;
    this.loop();
  }

  update() {
    this.player1.update();
    this.metals.map(elem => this.player1.collision(elem));
    this.bricks.map(elem => this.player1.collision(elem));
    this.waters.map(elem => this.player1.collision(elem));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player1.draw();
    this.grasses.map(elem => elem.draw());
    this.metals.map(elem => elem.draw());
    this.bricks.map(elem => elem.draw());
    this.waters.map(elem => elem.draw());
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

class Player extends Entity {
  constructor(initialArguments) {
    super({ ...initialArguments, w: 50, h: 50 });
    this.dx = this.x;
    this.dy = this.y;
    this.step = 1;
    this.isDirection = 1;
    this.isMove = [];
    this.isCollision = false;
    this.color = 'red';

    // events
    document.addEventListener('keydown', e => {
      this.actions(e);
    });
    document.addEventListener('keyup', e => {
      this.reset(e);
    });
  }

  update() {
    switch (this.isMove[this.isMove.length - 1]) {
      case 'w':
        this.isDirection = 1;
        break;
      case 's':
        this.isDirection = 2;
        break;
      case 'a':
        this.isDirection = 3;
        break;
      case 'd':
        this.isDirection = 4;
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
    if (e.key === 'w' || e.key === 's' || e.key === 'a' || e.key === 'd') {
      !this.isMove.includes(e.key) && this.isMove.push(e.key);
    }
  }

  move() {
    if (this.isMove.length === 0) return;

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
    this.isMove = this.isMove.filter(letter => letter !== e.key);
    this.isCollision = false;
    this.dx = this.x;
    this.dy = this.y;
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

class Block extends Entity {
  constructor(initialArguments) {
    super({ ...initialArguments, w: 50, h: 50 });
  }
}

class Grass extends Block {
  constructor(initialArguments) {
    super(initialArguments);
    this.color = '#85C441';
  }
}

class Metal extends Block {
  constructor(initialArguments) {
    super(initialArguments);
    this.color = '#ACABAC';
  }
}

class Brick extends Block {
  constructor(initialArguments) {
    super(initialArguments);
    this.color = '#974B22';
  }
}

class Water extends Block {
  constructor(initialArguments) {
    super(initialArguments);
    this.color = '#4C5CA9';
  }
}
