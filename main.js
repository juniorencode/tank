const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 650;
canvas.height = 650;

const calculate = () => {
  // do something
};

const draw = () => {
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
