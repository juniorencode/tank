let grassesPosition = [
  { x: 0, y: 50, w: 50, h: 50 },
  { x: 0, y: 100, w: 50, h: 50 },
  { x: 0, y: 150, w: 50, h: 50 },
  { x: 0, y: 200, w: 50, h: 50 },
  { x: 0, y: 250, w: 50, h: 50 },
  { x: 50, y: 250, w: 50, h: 50 },
  { x: 150, y: 100, w: 50, h: 50 },
  { x: 250, y: 100, w: 50, h: 50 },
  { x: 200, y: 100, w: 50, h: 50 },
  { x: 250, y: 300, w: 50, h: 50 },
  { x: 300, y: 300, w: 50, h: 50 },
  { x: 200, y: 350, w: 50, h: 50 },
  { x: 0, y: 500, w: 50, h: 50 },
  { x: 500, y: 200, w: 50, h: 50 },
  { x: 500, y: 250, w: 50, h: 50 },
  { x: 500, y: 300, w: 50, h: 50 }
];

let metalsPosition = [
  { x: 150, y: 0, w: 50, h: 50 },
  { x: 150, y: 50, w: 50, h: 50 },
  { x: 150, y: 350, w: 50, h: 50 },
  { x: 150, y: 400, w: 50, h: 50 },
  { x: 0, y: 400, w: 50, h: 50 },
  { x: 350, y: 300, w: 50, h: 50 },
  { x: 400, y: 250, w: 50, h: 50 },
  { x: 300, y: 200, w: 50, h: 50 },
  { x: 350, y: 0, w: 50, h: 50 },
  { x: 450, y: 150, w: 50, h: 50 },
  { x: 500, y: 100, w: 50, h: 50 },
  { x: 600, y: 150, w: 50, h: 50 },
  { x: 600, y: 200, w: 50, h: 50 },
  { x: 500, y: 450, w: 50, h: 50 }
];
let bricksPosition = [
  { x: 50, y: 50, w: 50, h: 50 },
  { x: 50, y: 100, w: 50, h: 50 },
  { x: 0, y: 300, w: 50, h: 50 },
  { x: 100, y: 300, w: 50, h: 50 },
  { x: 50, y: 300, w: 50, h: 50 },
  { x: 150, y: 150, w: 50, h: 50 },
  { x: 150, y: 200, w: 50, h: 50 },
  { x: 150, y: 250, w: 50, h: 50 },
  { x: 150, y: 300, w: 50, h: 50 },
  { x: 200, y: 250, w: 50, h: 50 },
  { x: 200, y: 300, w: 50, h: 50 },
  { x: 250, y: 250, w: 50, h: 50 },
  { x: 250, y: 200, w: 50, h: 50 },
  { x: 50, y: 400, w: 50, h: 50 },
  { x: 50, y: 450, w: 50, h: 50 },
  { x: 50, y: 500, w: 50, h: 50 },
  { x: 50, y: 550, w: 50, h: 50 },
  { x: 50, y: 600, w: 50, h: 50 },
  { x: 150, y: 600, w: 50, h: 50 },
  { x: 150, y: 500, w: 50, h: 50 },
  { x: 150, y: 450, w: 50, h: 50 },
  { x: 250, y: 350, w: 50, h: 50 },
  { x: 250, y: 400, w: 50, h: 50 },
  { x: 250, y: 450, w: 50, h: 50 },
  { x: 250, y: 500, w: 50, h: 50 },
  { x: 300, y: 500, w: 50, h: 50 },
  { x: 350, y: 500, w: 50, h: 50 },
  { x: 300, y: 450, w: 50, h: 50 },
  { x: 350, y: 450, w: 50, h: 50 },
  { x: 350, y: 400, w: 50, h: 50 },
  { x: 350, y: 350, w: 50, h: 50 },
  { x: 400, y: 300, w: 50, h: 50 },
  { x: 450, y: 300, w: 50, h: 50 },
  { x: 300, y: 150, w: 50, h: 50 },
  { x: 300, y: 100, w: 50, h: 50 },
  { x: 350, y: 100, w: 50, h: 50 },
  { x: 350, y: 150, w: 50, h: 50 },
  { x: 350, y: 50, w: 50, h: 50 },
  { x: 450, y: 250, w: 50, h: 50 },
  { x: 450, y: 200, w: 50, h: 50 },
  { x: 450, y: 100, w: 50, h: 50 },
  { x: 450, y: 50, w: 50, h: 50 },
  { x: 550, y: 100, w: 50, h: 50 },
  { x: 550, y: 50, w: 50, h: 50 },
  { x: 550, y: 200, w: 50, h: 50 },
  { x: 450, y: 350, w: 50, h: 50 },
  { x: 550, y: 400, w: 50, h: 50 },
  { x: 550, y: 350, w: 50, h: 50 },
  { x: 550, y: 300, w: 50, h: 50 },
  { x: 550, y: 450, w: 50, h: 50 },
  { x: 450, y: 450, w: 50, h: 50 },
  { x: 550, y: 550, w: 50, h: 50 },
  { x: 550, y: 600, w: 50, h: 50 },
  { x: 500, y: 600, w: 50, h: 50 },
  { x: 450, y: 600, w: 50, h: 50 },
  { x: 450, y: 550, w: 50, h: 50 },
  { x: 275, y: 575, w: 25, h: 25 },
  { x: 350, y: 575, w: 25, h: 25 },
  { x: 300, y: 575, w: 50, h: 25 },
  { x: 275, y: 600, w: 25, h: 50 },
  { x: 350, y: 600, w: 25, h: 50 }
];
let watersPosition = [
  { x: 100, y: 400, w: 50, h: 50 },
  { x: 0, y: 450, w: 50, h: 50 },
  { x: 0, y: 550, w: 50, h: 50 },
  { x: 0, y: 600, w: 50, h: 50 },
  { x: 450, y: 400, w: 50, h: 50 },
  { x: 500, y: 400, w: 50, h: 50 },
  { x: 600, y: 400, w: 50, h: 50 },
  { x: 600, y: 450, w: 50, h: 50 },
  { x: 600, y: 500, w: 50, h: 50 },
  { x: 600, y: 550, w: 50, h: 50 }
];