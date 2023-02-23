class Game {
  constructor() {
    // looping
    this.loop();
  }

  update() {
    // do something
  }

  draw() {
    // do something
  }

  loop() {
    requestAnimationFrame(() => {
      this.loop();
    });
  }
}
