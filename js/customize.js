class Menu {
  constructor(arg) {
    // initial
    this.game = arg;
    this.isEvents = false;
    this.option = 1;

    // load images
    this.background = this.game.createRectangle({
      layer: 1,
      color: '#000',
      w: 384,
      h: 384
    });

    this.title = this.game.createSprite({
      layer: 1,
      src: '../img/title.png',
      original: true,
      middle: true,
      y: -32
    });

    this.menu = this.game.createSprite({
      layer: 1,
      src: '../img/menu.png',
      original: true,
      middle: true,
      x: 12,
      y: 32
    });

    this.indicator = this.game.createSprite({
      layer: 2,
      src: '../img/tank_yellow.png',
      middle: true,
      x: -38,
      y: 25,
      angle: 90,
      columns: 2
    });

    this.x = null;
  }

  update() {
    if (!this.setEvents) {
      this.createEvents();
      this.setEvents = true;
    }

    this.indicator.update();
  }

  draw() {
    this.background.draw();
    this.title.draw();
    this.menu.draw();
    this.indicator.draw();
  }

  handleSelect(e) {
    switch (e.code) {
      case 'KeyW':
        this.option = 1;
        this.indicator.moveY(25);
        break;
      case 'KeyS':
        this.option = 2;
        this.indicator.moveY(40);
        break;
      case 'Enter':
        this.game.changeScene(1);
        break;
      case 'KeyR':
        this.removeEvents();
      default:
        break;
    }
  }

  createEvents() {
    this.game.events.removeAllListeners(document);
    this.game.events.addListener(document, 'keypress', e => {
      this.handleSelect(e);
    });
  }

  removeEvents() {
    this.game.events.removeAllListeners(document);
  }
}

class Level {
  constructor(arg) {
    this.game = arg.game;
    this.setEvents = false;
    this.map = arg.map;

    // materials
    this.players = [];
    this.bullets = [];

    this.grasses = [];
    this.waters = [];
    this.metals = [];
    this.bricks = [];

    // load images
    this.background = this.game.createRectangle({
      layer: 1,
      color: '#000',
      w: 384,
      h: 384
    });
    this.createPlayer();
    this.createMaterials();
  }

  update() {
    if (!this.setEvents) {
      this.createEvents();
      this.setEvents = true;
    }
    this.players.map(elem => elem.update());
  }

  draw() {
    this.background.draw();
    this.players.map(elem => elem.draw());
    this.waters.map(elem => elem.draw());
    this.grasses.map(elem => elem.draw());
    this.metals.map(elem => elem.draw());
    this.bricks.map(elem => elem.draw());
  }

  handleTest(e) {
    if (e.code === 'KeyP') {
      this.game.changeScene(0);
    }
  }

  createEvents() {
    this.game.events.removeAllListeners(document);
    this.game.events.addListener(document, 'keypress', e => {
      this.handleTest(e);
    });
  }

  createMaterials() {
    this.map.water.map(elem => this.createWater(elem));
    this.map.grass.map(elem => this.createGrass(elem));
    this.map.metal.map(elem => this.createMetal(elem));
    this.map.brick.map(elem => this.createBrick(elem));
  }

  createWater(obj) {
    this.waters.push(
      this.game.createSprite({
        layer: 3,
        pattern: true,
        src: '../img/water.png',
        ...obj
      })
    );
  }

  createGrass(obj) {
    this.grasses.push(
      this.game.createSprite({
        layer: 3,
        pattern: true,
        src: '../img/grass.png',
        ...obj
      })
    );
  }

  createMetal(obj) {
    this.metals.push(
      this.game.createSprite({
        layer: 3,
        pattern: true,
        src: '../img/metal.png',
        ...obj
      })
    );
  }

  createBrick(obj) {
    this.bricks.push(
      this.game.createSprite({
        layer: 3,
        pattern: true,
        src: '../img/brick.png',
        ...obj
      })
    );
  }

  createPlayer() {
    this.players.push(
      this.game.createSprite({
        layer: 2,
        src: '../img/tank_yellow.png',
        // ...obj
        x: 64,
        // x: 128,
        y: 192,
        w: 16,
        h: 16,
        columns: 2
      })
    );
  }
}