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

class Rectangle {
  constructor(arg) {
    // this.game = arg.game;
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

class Sprite {
  constructor(arg) {
    // this.game = arg.game;
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
}

class Canvas {
  constructor(arg) {
    this.loop = arg.loop;
    this.content = arg.content;
    this.tile = arg.tile || 50;
    this.bits = arg.bits || 16;
    this.rows = arg.rows || 13;
    this.columns = arg.columns || 13;
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
    // normalize
    // console.log(this.layers);
    // console.log(this.queue);

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
    this.loadIncomplete++;
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
