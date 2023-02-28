class Game {
  constructor(arg) {
    // initial
    this.images = [];
    this.maxLayer = 0;

    this.canvas = new Canvas({
      loop: () => this.loop(),
      images: this.images,
      ...arg
    });

    this.events = new Handle();

    this.nScene = 0;
    this.scenes = [];

    this.nPlayers = 2;
    this.players = [];
    // this.scenes.push(new Menu(this.public()));
    this.scenes.push(new Level({ game: this.public(), map: maps[0] }));
  }

  public() {
    // public methods
    return {
      changeScene: num => {
        this.changeScene(num);
      },
      drawLayer: obj => {
        this.drawLayer(obj);
      },
      createRectangle: obj => {
        return this.createRectangle(obj);
      },
      createSprite: obj => {
        return this.createSprite(obj);
      },
      createBrick: obj => {
        return this.createBrick(obj);
      },
      createPlayer: obj => {
        return this.createPlayer(obj);
      },
      createBullet: obj => {
        return this.createBullet(obj);
      },
      events: this.events,
      collisionWithMapBoundaries: obj => {
        return this.collisionWithMapBoundaries(obj);
      }
    };
  }

  update() {
    this.scenes[this.nScene].update();
  }

  draw() {
    this.scenes[this.nScene].draw();
    this.canvas.draw();
  }

  loop() {
    new FpsController(() => {
      this.update();
    }, 60);
    new FpsController(() => {
      this.draw();
    }, 60);
  }

  changeScene(num) {
    this.scenes[num].setEvents = false;
    this.nScene = num;
    this.canvas.reset();
  }

  createRectangle(obj) {
    const rectangle = new Rectangle({
      game: this.public(),
      canvas: this.canvas.public(),
      layer: 1,
      angle: 0,
      x: 0,
      y: 0,
      color: '#000',
      ...obj
    });

    this.canvas.setMaxLayer(obj.layer);

    return rectangle;
  }

  createSprite(obj) {
    const sprite = new Sprite({
      canvas: this.canvas.public(),
      layer: 1,
      pattern: false,
      angle: 0,
      sx: 0,
      sy: 0,
      sw: this.canvas.getBits(),
      sh: this.canvas.getBits(),
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      columns: 1,
      delay: 3,
      ...obj
    });

    this.canvas.setMaxLayer(obj.layer);
    this.canvas.putImage();
    this.images.push(sprite);

    return sprite;
  }

  createBrick(obj) {
    const brick = new Brick({
      game: this.public(),
      layer: 3,
      pattern: true,
      src: '../img/brick.png',
      ...obj
    });

    return brick;
  }

  createPlayer(obj) {
    const player = new Player({
      game: this.public(),
      controls: playersControls[this.players.length],
      ...playersPosition[this.players.length],
      layer: 2,
      src: '../img/tank_yellow.png',
      columns: 2,
      ...obj
    });

    this.players.push(player);
    return player;
  }

  createBullet(obj) {
    const bullet = new Bullet({
      game: this.public(),
      layer: 2,
      src: '../img/bullet.png',
      original: true,
      w: 4,
      h: 4,
      player: obj
    });

    return bullet;
  }

  collisionWithMapBoundaries(obj) {
    if (
      obj.dx + obj.w > this.canvas.oWidth ||
      obj.dx < 0 ||
      obj.dy + obj.h > this.canvas.oHeight ||
      obj.dy < 0
    ) {
      obj.isCollision = true;
    }
  }
}
