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

    this.players.map(player => {
      player.update();
      this.metals.map(elem => player.collision(elem));
      this.bricks.map(elem => player.collision(elem));
      this.waters.map(elem => player.collision(elem));
    });

    this.bullets.map((elemB, i) => {
      elemB.update();
      this.players.map(elem => elemB.collision(elem));
      this.metals.map(elem => elemB.collision(elem));
      this.bricks.map(elem => {
        if (elemB.collision(elem)) {
          elem.damage(elemB);
        }
      });

      // this.enemies.map(elem => elemB.collision(elem));
      this.bullets.map((elem, j) => i !== j && elemB.collision(elem));

      // elemB.collisionInside();
      if (elemB.isCollision) {
        this.bullets.splice(i, 1);
      }
    });

    this.bricks.map((brick, i) => {
      brick.update();

      if (brick.destroyed) {
        this.bricks.splice(i, 1);
      }
    });
  }

  draw() {
    this.background.draw();
    this.players.map(elem => elem.draw());
    this.waters.map(elem => elem.draw());
    this.grasses.map(elem => elem.draw());
    this.bricks.map(elem => elem.draw());
    this.metals.map(elem => elem.draw());
    this.bullets.map(elem => elem.draw());
  }

  createEvents() {
    this.game.events.removeAllListeners(document);
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
        layer: 1,
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
        layer: 1,
        pattern: true,
        src: '../img/metal.png',
        ...obj
      })
    );
  }

  // createBrick(obj) {
  //   this.bricks.push(
  //     this.game.createSprite({
  //       layer: 3,
  //       pattern: true,
  //       src: '../img/brick.png',
  //       ...obj
  //     })
  //   );
  // }

  createBrick(obj) {
    this.bricks.push(
      this.game.createBrick({
        layer: 4,
        ...obj
      })
    );
  }

  createPlayer() {
    this.players.push(
      this.game.createPlayer({
        level: {
          createBullet: obj => {
            return this.createBullet(obj);
          }
        },
        src: '../img/tank_yellow.png'
      })
    );
    this.players.push(
      this.game.createPlayer({
        level: {
          createBullet: obj => {
            return this.createBullet(obj);
          }
        },
        src: '../img/tank3.png'
      })
    );
  }

  createBullet(obj) {
    this.bullets.push(this.game.createBullet(obj));
  }
}
