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

    // create a menu scene
    // this.menu = new Menu(this.public());

    // create a game
    // this.level1 = new Level({ game: this.public(), map: maps[0] });

    this.scenes.push(new Menu(this.public()));
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
      events: this.events
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
    }, 1000);
    new FpsController(() => {
      this.draw();
    }, 1000);
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
      // game: this.public(),
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
      delay: 12,
      ...obj
    });

    this.canvas.setMaxLayer(obj.layer);
    this.canvas.putImage();
    this.images.push(sprite);

    return sprite;
  }
}
