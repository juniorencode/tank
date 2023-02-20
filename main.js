const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 650;
canvas.height = 650;

const calculate = () => {
  // do something
};

const draw = () => {
  // water
  ctx.fillStyle = '#4C5CA9';
  ctx.fillRect(100, 400, 50, 50);
  ctx.fillRect(0, 450, 50, 50);
  ctx.fillRect(0, 550, 50, 50);
  ctx.fillRect(0, 600, 50, 50);
  ctx.fillRect(450, 400, 50, 50);
  ctx.fillRect(500, 400, 50, 50);
  ctx.fillRect(600, 400, 50, 50);
  ctx.fillRect(600, 450, 50, 50);
  ctx.fillRect(600, 500, 50, 50);
  ctx.fillRect(600, 550, 50, 50);
  // do something
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 50, 50);
};

const loop = () => {
  draw();
  window.requestAnimationFrame(loop);
};

loop();

console.log(canvas);
