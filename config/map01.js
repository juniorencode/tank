const map01 = {
  water: [
    { x: 32, y: 128, w: 16, h: 16 },
    { x: 0, y: 144, w: 16, h: 16 },
    { x: 144, y: 160, w: 32, h: 16 },
    { x: 192, y: 128, w: 16, h: 64 },
    { x: 0, y: 176, w: 16, h: 32 }
  ],
  grass: [
    { x: 16, y: 80, w: 16, h: 16 },
    { x: 64, y: 112, w: 16, h: 16 },
    { x: 0, y: 160, w: 16, h: 16 },
    { x: 0, y: 16, w: 16, h: 80 },
    { x: 48, y: 32, w: 48, h: 16 },
    { x: 160, y: 64, w: 16, h: 48 },
    { x: 80, y: 96, w: 32, h: 16 }
  ],
  metal: [
    { x: 48, y: 0, w: 16, h: 16 },
    { x: 48, y: 16, w: 16, h: 16 },
    { x: 48, y: 112, w: 16, h: 16 },
    { x: 48, y: 128, w: 16, h: 16 },
    { x: 0, y: 128, w: 16, h: 16 },
    { x: 112, y: 96, w: 16, h: 16 },
    { x: 128, y: 80, w: 16, h: 16 },
    { x: 96, y: 64, w: 16, h: 16 },
    { x: 112, y: 0, w: 16, h: 16 },
    { x: 144, y: 48, w: 16, h: 16 },
    { x: 160, y: 32, w: 16, h: 16 },
    { x: 192, y: 48, w: 16, h: 16 },
    { x: 192, y: 64, w: 16, h: 16 },
    { x: 160, y: 144, w: 16, h: 16 }
  ],
  brick: [
    { x: 16, y: 16, w: 16, h: 16 },
    { x: 16, y: 32, w: 16, h: 16 },
    { x: 0, y: 96, w: 16, h: 16 },
    { x: 32, y: 96, w: 16, h: 16 },
    { x: 16, y: 96, w: 16, h: 16 },
    { x: 48, y: 48, w: 16, h: 16 },
    { x: 48, y: 64, w: 16, h: 16 },
    { x: 48, y: 80, w: 16, h: 16 },
    { x: 48, y: 96, w: 16, h: 16 },
    { x: 64, y: 80, w: 16, h: 16 },
    { x: 64, y: 96, w: 16, h: 16 },
    { x: 80, y: 80, w: 16, h: 16 },
    { x: 80, y: 64, w: 16, h: 16 },
    { x: 16, y: 128, w: 16, h: 16 },
    { x: 16, y: 144, w: 16, h: 16 },
    { x: 16, y: 160, w: 16, h: 16 },
    { x: 16, y: 176, w: 16, h: 16 },
    { x: 16, y: 192, w: 16, h: 16 },
    { x: 48, y: 192, w: 16, h: 16 },
    { x: 48, y: 160, w: 16, h: 16 },
    { x: 48, y: 144, w: 16, h: 16 },
    { x: 80, y: 112, w: 16, h: 16 },
    { x: 80, y: 128, w: 16, h: 16 },
    { x: 80, y: 144, w: 16, h: 16 },
    { x: 80, y: 160, w: 16, h: 16 },
    { x: 96, y: 160, w: 16, h: 16 },
    { x: 112, y: 160, w: 16, h: 16 },
    { x: 96, y: 144, w: 16, h: 16 },
    { x: 112, y: 144, w: 16, h: 16 },
    { x: 112, y: 128, w: 16, h: 16 },
    { x: 112, y: 112, w: 16, h: 16 },
    { x: 128, y: 96, w: 16, h: 16 },
    { x: 144, y: 96, w: 16, h: 16 },
    { x: 96, y: 48, w: 16, h: 16 },
    { x: 96, y: 32, w: 16, h: 16 },
    { x: 112, y: 32, w: 16, h: 16 },
    { x: 112, y: 48, w: 16, h: 16 },
    { x: 112, y: 16, w: 16, h: 16 },
    { x: 144, y: 80, w: 16, h: 16 },
    { x: 144, y: 64, w: 16, h: 16 },
    { x: 144, y: 32, w: 16, h: 16 },
    { x: 144, y: 16, w: 16, h: 16 },
    { x: 176, y: 32, w: 16, h: 16 },
    { x: 176, y: 16, w: 16, h: 16 },
    { x: 176, y: 64, w: 16, h: 16 },
    { x: 144, y: 112, w: 16, h: 16 },
    { x: 176, y: 128, w: 16, h: 16 },
    { x: 176, y: 112, w: 16, h: 16 },
    { x: 176, y: 96, w: 16, h: 16 },
    { x: 176, y: 144, w: 16, h: 16 },
    { x: 144, y: 144, w: 16, h: 16 },
    { x: 176, y: 176, w: 16, h: 16 },
    { x: 176, y: 192, w: 16, h: 16 },
    { x: 160, y: 192, w: 16, h: 16 },
    { x: 144, y: 192, w: 16, h: 16 },
    { x: 144, y: 176, w: 16, h: 16 },
    { x: 88, y: 192, w: 8, h: 16 },
    { x: 88, y: 184, w: 8, h: 8 },
    { x: 96, y: 184, w: 16, h: 8 },
    { x: 112, y: 184, w: 8, h: 8 },
    { x: 112, y: 192, w: 8, h: 16 }
  ]
};
