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

class Handle {
  constructor() {
    this._eventHandlers = {};
  }

  addListener(node, event, handler, capture = false) {
    if (!(node in this._eventHandlers)) this._eventHandlers[node] = {};

    if (!(event in this._eventHandlers[node]))
      this._eventHandlers[node][event] = [];

    this._eventHandlers[node][event].push([handler, capture]);
    node.addEventListener(event, handler, capture);
  }

  removeListener(node, handlers, event) {
    const eventHandlers = handlers[event];

    for (let i = 0; i < eventHandlers.length; i++) {
      let handler = eventHandlers[i];

      node.removeEventListener(event, handler[0], handler[1]);
    }
  }

  removeListeners(node, event) {
    if (node in this._eventHandlers) {
      let handlers = this._eventHandlers[node];

      if (event in handlers) {
        this.removeListener(node, handlers, event);
      }
    }
  }

  removeAllListeners(node) {
    if (node in this._eventHandlers) {
      let handlers = this._eventHandlers[node];

      for (const event in handlers) {
        this.removeListener(node, handlers, event);
      }
    }
  }
}

class Rectangle {
  constructor(arg) {
    this.canvas = arg.canvas;
    this.layer = arg.layer;
    this.x = arg.x;
    this.y = arg.y;
    this.w = arg.w;
    this.h = arg.h;
    this.middle = !!arg.middle;
    this.color = arg.color;

    this.draw = () => {
      this.canvas.putInList(this);
    };

    this.middle && this.setMiddle();
  }

  setMiddle() {
    this.x = this.canvas.toInTheMiddleX(this.w) + this.x;
    this.y = this.canvas.toInTheMiddleY(this.h) + this.y;
  }

  moveY(num) {
    const newY = this.canvas.toInTheMiddleY(this.h) + num;
    this.ty = newY + this.h / 2;
  }
}

class Canvas {
  constructor(arg) {
    this.loop = arg.loop;
    this.content = arg.content;
    this.tile = arg.tile || 50;
    this.bits = arg.bits || 16;
    this.rows = arg.rows || 13;
    this.columns = arg.columns || 13;
    this.oWidth = this.bits * this.columns;
    this.oHeight = this.bits * this.rows;
    this.width = this.tile * this.columns;
    this.height = this.tile * this.rows;

    this.content.style.width = this.width + 'px';
    this.content.style.height = this.height + 'px';

    this.loadIncomplete = 0;

    this.maxLayer = 0;
    this.layers = [];
    this.queue = [];
    this.drawOnce = false;
  }

  public() {
    // public methods
    return {
      getBits: () => {
        return this.getBits();
      },
      putInList: obj => {
        this.putInList(obj);
      },
      checkLoad: () => {
        this.checkLoad();
      },
      toInTheMiddleX: num => {
        return this.toInTheMiddleX(num);
      },
      toInTheMiddleY: num => {
        return this.toInTheMiddleY(num);
      }
    };
  }

  createLayer() {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    this.content.append(canvas);
    this.layers.push(canvas.getContext('2d'));
  }

  draw() {
    // draw once
    if (!this.drawOnce) {
      for (let i = 0; i < this.layers.length; i = i + 2) {
        this.drawChoose(i);
      }

      this.drawOnce = true;
    }

    // draw ever
    for (let i = 1; i < this.layers.length; i = i + 2) {
      this.drawChoose(i);
    }

    // clear queue
    this.queue.map(stack => (stack.length = 0));
  }

  drawChoose(i) {
    this.layers[i].clearRect(0, 0, this.width, this.height);
    this.layers[i].imageSmoothingEnabled = false;
    this.queue[i].map(image => {
      switch (image.constructor.name) {
        case 'Rectangle':
          this.drawRectangle(i, image);
          break;
        case 'Sprite':
          this.drawImage(i, image);
          break;
      }
    });
  }

  drawRectangle(num, image) {
    this.layers[num].fillStyle = image.color;
    this.layers[num].fillRect(
      this.toRecalculate(image.x),
      this.toRecalculate(image.y),
      this.toRecalculate(image.w),
      this.toRecalculate(image.h)
    );
  }

  drawImage(num, image) {
    if (image.pattern) {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = this.toRecalculate(image.sw);
      pCanvas.height = this.toRecalculate(image.sh);
      const pCtx = pCanvas.getContext('2d');
      pCtx.imageSmoothingEnabled = false;
      pCtx.drawImage(
        image.element,
        image.sx,
        image.sy,
        image.sw,
        image.sh,
        0,
        0,
        this.toRecalculate(image.sw),
        this.toRecalculate(image.sh)
      );
      const pattern = this.layers[num].createPattern(pCanvas, 'repeat');
      this.layers[num].fillStyle = pattern;
      this.layers[num].fillRect(
        this.toRecalculate(image.x),
        this.toRecalculate(image.y),
        this.toRecalculate(image.w),
        this.toRecalculate(image.h)
      );
    } else {
      this.layers[num].translate(
        this.toRecalculate(image.tx),
        this.toRecalculate(image.ty)
      );
      this.layers[num].rotate(this.toRadians(image.angle));
      this.layers[num].scale(1, 1);
      this.layers[num].drawImage(
        image.element,
        image.sw * image.currentFrame,
        image.sy,
        image.sw,
        image.sh,
        this.toRecalculate(image.x),
        this.toRecalculate(image.y),
        this.toRecalculate(image.w),
        this.toRecalculate(image.h)
      );
      this.layers[num].scale(1, 1);
      this.layers[num].rotate(this.toRadians(-image.angle));
      this.layers[num].translate(
        this.toRecalculate(-image.tx),
        this.toRecalculate(-image.ty)
      );
    }
  }

  getBits() {
    return this.bits;
  }

  setMaxLayer(num) {
    this.maxLayer = this.maxLayer > num ? this.maxLayer : num;

    if (this.queue.length < this.maxLayer) {
      this.queue.push([]);
    }
  }

  putImage() {
    !this.drawOnce && this.loadIncomplete++;
  }

  checkLoad() {
    this.loadIncomplete--;

    if (this.loadIncomplete === 0) {
      for (let i = 0; i < this.maxLayer; i++) {
        this.createLayer();
      }

      this.loop();
    }
  }

  putInList(image) {
    if (!this.drawOnce || image.layer % 2 === 0) {
      this.queue[image.layer - 1].push(image);
    }
  }

  toInTheMiddleX(num) {
    return (this.bits * this.columns) / 2 - num / 2;
  }

  toInTheMiddleY(num) {
    return (this.bits * this.rows) / 2 - num / 2;
  }

  toRecalculate(num) {
    return num * (this.tile / this.bits);
  }

  toRadians(num) {
    return num * (Math.PI / 180);
  }

  reset() {
    this.layers.map(layer => {
      layer.clearRect(0, 0, this.width, this.height);
    });
    this.drawOnce = false;
  }
}

class Sprite {
  constructor(arg) {
    this.canvas = arg.canvas;
    this.layer = arg.layer;
    this.pattern = arg.pattern;
    this.element = new Image();
    this.element.src = arg.src;
    this.load = false;
    this.angle = arg.angle;
    this.tx = 0;
    this.ty = 0;
    this.sx = arg.sx;
    this.sy = arg.sy;
    this.sw = arg.sw;
    this.sh = arg.sh;
    this.x = arg.x;
    this.y = arg.y;
    this.w = arg.w;
    this.h = arg.h;
    this.original = !!arg.original;
    this.middle = !!arg.middle;
    // this.move = { x: 0, y: 0 };
    this.count = 0;
    this.columns = arg.columns;
    this.delay = arg.delay;
    this.currentFrame = 0;

    this.draw = () => {
      this.canvas.putInList(this);
    };

    this.element.onload = () => {
      this.load = true;
      this.canvas.checkLoad();
      this.resize();
      this.middle && this.setMiddle();
      this.angle !== 0 && this.setAngle();
    };
  }

  update() {
    this.count++;
    this.count = this.count % this.delay;

    if (this.count === 0) {
      this.currentFrame++;
      this.currentFrame = this.currentFrame % this.columns;
    }
  }

  resize() {
    if (this.original) {
      this.sw = this.element.width;
      this.sh = this.element.height;
    }

    this.w = !!this.w ? this.w : this.sw;
    this.h = !!this.h ? this.h : this.sh;
  }

  setMiddle() {
    this.x = this.canvas.toInTheMiddleX(this.w) + this.x;
    this.y = this.canvas.toInTheMiddleY(this.h) + this.y;
  }

  setAngle() {
    this.tx = this.w / 2 + this.x;
    this.ty = this.y + this.h / 2;
    this.x = -this.w / 2;
    this.y = -this.h / 2;
  }

  moveX(num) {
    const newX = this.canvas.toInTheMiddleX(this.w) + num;
    this.tx = newX + this.w / 2;
  }

  moveY(num) {
    const newY = this.canvas.toInTheMiddleY(this.h) + num;
    this.ty = newY + this.h / 2;
  }

  setX(num) {
    this.x = num;
  }

  setY(num) {
    this.y = num;
  }

  setPosition({ x, y }) {
    this.x = x;
    this.y = y;
    this.setAngle();
  }
}

class Player {
  constructor(arg) {
    this.game = arg.game;
    this.level = arg.level;
    this.setEvents = false;
    this.controls = arg.controls;
    this.sprite = this.game.createSprite({
      layer: arg.layer,
      src: arg.src,
      x: arg.x,
      y: arg.y,
      columns: arg.columns
    });

    this.x = arg.x;
    this.y = arg.y;
    this.dx = this.x;
    this.dy = this.y;
    this.w = 0;
    this.h = 0;
    this.step = 1;
    this.isDirection = 1;
    this.isMove = [];
    this.isCollision = false;

    // this.createEvents();
  }

  update() {
    if (!this.setEvents) {
      this.createEvents();
      this.w = this.sprite.w;
      this.h = this.sprite.h;
      this.setEvents = true;
    }
    switch (this.isMove[this.isMove.length - 1]) {
      case this.controls.UP:
        this.changeDirection(1);
        break;
      case this.controls.RIGHT:
        this.changeDirection(2);
        break;
      case this.controls.DOWN:
        this.changeDirection(3);
        break;
      case this.controls.LEFT:
        this.changeDirection(4);
        break;
    }

    // normalize position
    if (!this.isCollision) {
      this.x = this.dx;
      this.y = this.dy;
      this.sprite.setPosition({ x: this.x, y: this.y });
    }
    this.move();

    this.sprite.update();

    this.game.collisionWithMapBoundaries(this);
  }

  draw() {
    this.sprite.draw();
  }

  handleAction(e) {
    const key = e.code;
    if (
      key === this.controls.UP ||
      key === this.controls.RIGHT ||
      key === this.controls.DOWN ||
      key === this.controls.LEFT
    ) {
      if (!this.isMove.includes(key)) {
        this.isMove.push(key);
        this.isCollision = false;
        this.dx = this.x;
        this.dy = this.y;
      }
    }
    if (key === this.controls.SHOOT) {
      this.level.createBullet({
        x: this.x,
        y: this.y,
        w: this.w,
        h: this.h,
        direction: this.isDirection
      });
    }
  }

  handleReset(e) {
    this.isMove = this.isMove.filter(letter => letter !== e.code);
    this.isCollision = false;
    this.dx = this.x;
    this.dy = this.y;
  }

  createEvents() {
    this.game.events.addListener(document, 'keydown', e => {
      this.handleAction(e);
    });
    this.game.events.addListener(document, 'keyup', e => {
      this.handleReset(e);
    });
  }

  changeDirection(num) {
    if (this.isDirection === num) return;
    this.isDirection = num;
    this.sprite.angle = (num - 1) * 90;
  }

  move() {
    if (this.isMove.length === 0) return;

    this.recalculate();
    if (this.isDirection === 1) {
      this.dy = this.y - this.step;
    }

    if (this.isDirection === 2) {
      this.dx = this.x + this.step;
    }

    if (this.isDirection === 3) {
      this.dy = this.y + this.step;
    }

    if (this.isDirection === 4) {
      this.dx = this.x - this.step;
    }
  }
  recalculate() {
    let rx = Math.trunc(this.x / this.w) * this.w;
    let ry = Math.trunc(this.y / this.w) * this.w;
    if (this.isDirection == 1 || this.isDirection == 3) {
      let tankP = this.w / 2 + this.x;
      if (tankP >= rx && tankP <= rx + 5) this.x = rx - 8;
      if (tankP > rx + 5 && tankP <= rx + 11) this.x = rx;
      if (tankP > rx + 11 && tankP < rx + this.w) this.x = rx + 8;
    }
    if (this.isDirection == 2 || this.isDirection == 4) {
      let tankP = this.w / 2 + this.y;
      if (tankP >= ry && tankP <= ry + 5) this.y = ry - 8;
      if (tankP > ry + 5 && tankP <= ry + 11) this.y = ry;
      if (tankP > ry + 11 && tankP < ry + this.w) this.y = ry + 8;
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
      block.isCollision = true;
    }
  }
}

class Bullet {
  constructor(arg) {
    this.game = arg.game;
    this.player = arg.player;
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.isDirection = 1;
    this.speedBullet = 1;
    this.w = arg.w;
    this.h = arg.h;
    this.isCollision = false;
    this.position();
    this.sprite = this.game.createSprite({
      layer: 2,
      src: '../img/bullet.png',
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
      original: true,
      angle: (this.player.direction - 1) * 90,
      columns: 1
    });
  }
  update() {
    // if (this.isCollisionB) return;
    if (this.player.direction === 1) {
      this.y -= this.speedBullet;
    }
    if (this.player.direction === 3) {
      this.y += this.speedBullet;
    }
    if (this.player.direction === 4) {
      this.x -= this.speedBullet;
    }
    if (this.player.direction === 2) {
      this.x += this.speedBullet;
    }
    // this.sprite.x = this.x;
    // this.sprite.y = this.y;
    this.sprite.setPosition({ x: this.x, y: this.y });
    // console.log(this.x, this.y);

    this.dx = this.x;
    this.dy = this.y;

    this.game.collisionWithMapBoundaries(this);
  }

  draw() {
    this.sprite.draw();
  }

  position() {
    switch (this.player.direction) {
      case 1:
        this.x = this.player.x + (this.player.w / 2 - this.w / 2);
        this.y = this.player.y - this.h;
        break;
      case 2:
        this.y = this.player.y + (this.player.h / 2 - this.h / 2);
        this.x = this.player.x + this.player.w;
        break;
      case 3:
        this.x = this.player.x + (this.player.w / 2 - this.w / 2);
        this.y = this.player.y + this.player.h;
        break;
      case 4:
        this.y = this.player.y + (this.player.h / 2 - this.h / 2);
        this.x = this.player.x - this.w;
        break;
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
      block.isCollision = true;
      return true;
    }
  }
}

// class Block {
//   constructor(arg) {
//     this.destroyed = false;
//   }
// }

class Brick {
  constructor(arg) {
    this.game = arg.game;
    this.x = arg.x;
    this.y = arg.y;
    this.w = arg.w;
    this.h = arg.h;
    this.destroyed = false;
    this.sprite = this.game.createSprite({
      layer: arg.layer,
      pattern: arg.pattern,
      src: arg.src,
      x: arg.x,
      y: arg.y
    });
  }

  update() {
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.w = this.w;
    this.sprite.h = this.h;

    this.sprite.update();
  }

  draw() {
    this.sprite.draw();
  }

  damage(bullet) {
    switch (bullet.player.direction) {
      case 1:
        this.h = this.h - 16 / 4;
        break;
      case 3:
        this.y = this.y + 16 / 4;
        this.h = this.h - 16 / 4;
        break;
      case 4:
        this.w = this.w - 16 / 4;
        break;
      case 2:
        this.x = this.x + 16 / 4;
        this.w = this.w - 16 / 4;
        break;
    }
    if (this.w <= 0 || this.h <= 0) {
      this.destroyed = true;
      return true;
    }
  }
}
