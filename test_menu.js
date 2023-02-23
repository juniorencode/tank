class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // normalize
    this.tile = 50;
    this.columns = 13;
    this.rows = 13;
    this.canvas.width = this.tile * this.columns;
    this.canvas.height = this.tile * this.rows;

    this.imgTitle = new Image();
    this.imgTitle.src = './img/title.png';
    this.wTitle = this.imgTitle.width * (50 / 16);
    this.hTitle = this.imgTitle.height * (50 / 16);
    this.xTitle = this.ctx.canvas.width / 2 - this.wTitle / 2;
    this.yTitle = this.ctx.canvas.height / 2 - this.hTitle / 2 - 32 * (50 / 16);

    this.imgMenu = new Image();
    this.imgMenu.src = './img/menu.png';
    this.wMenu = this.imgMenu.width * (50 / 16);
    this.hMenu = this.imgMenu.height * (50 / 16);
    this.xMenu = this.ctx.canvas.width / 2 - this.wMenu / 2;
    this.yMenu = this.ctx.canvas.height / 2 - this.hMenu / 2 + 32 * (50 / 16);

    this.imgTank = new Image();
    this.imgTank.src = './img/tank_yellow.png';
    this.wTank = 16 * (50 / 16);
    this.hTank = 16 * (50 / 16);
    this.xTank = this.ctx.canvas.width / 2 - this.wMenu / 2 - 24 * (50 / 16);
    // this.yTank =
    //   this.ctx.canvas.height / 2 -
    //   this.hMenu / 2 +
    //   32 * (50 / 16) -
    //   4 * (50 / 16);
    this.yTank =
      this.ctx.canvas.height / 2 -
      this.hMenu / 2 +
      32 * (50 / 16) +
      this.hMenu -
      this.wTank +
      4 * (50 / 16);

    this.loop();
  }

  update() {
    // do something
  }

  draw() {
    // do something
    this.ctx.imageSmoothingEnabled = false;

    this.ctx.drawImage(
      this.imgTitle,
      0,
      0,
      this.imgTitle.width,
      this.imgTitle.height,
      this.xTitle,
      this.yTitle,
      this.wTitle,
      this.hTitle
    );

    this.ctx.drawImage(
      this.imgMenu,
      0,
      0,
      this.imgMenu.width,
      this.imgMenu.height,
      this.xMenu,
      this.yMenu,
      this.wMenu,
      this.hMenu
    );

    this.ctx.translate(
      this.wTank / 2 + this.xTank,
      this.yTank + this.hTank / 2
    );
    this.ctx.rotate(90 * (Math.PI / 180));
    this.ctx.drawImage(
      this.imgTank,
      0,
      16 * 0,
      16,
      16,
      -this.wTank / 2,
      -this.hTank / 2,
      this.wTank,
      this.hTank
    );
    this.ctx.rotate(-Math.PI / 2);
    this.ctx.translate(
      -this.wTank / 2 - this.xTank,
      -this.yTank - this.hTank / 2
    );
  }

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => {
      this.loop();
    });
  }
}
