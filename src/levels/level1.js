export const level1 = {
  name: "Level 1: Boot Sequence",
  worldHeight: 3200,
  spawnPlatformId: 1,

  platforms: [
    { id: 1, x: 520, y: 3000, width: 400, height: 14 },
    { id: 2, x: 760, y: 2800, width: 180, height: 14 },
    { id: 3, x: 430, y: 2580, width: 160, height: 14 },
    { id: 4, x: 720, y: 2350, width: 150, height: 14 },
    { id: 5, x: 390, y: 2120, width: 170, height: 14 },
    { id: 6, x: 650, y: 1880, width: 160, height: 14 },
    { id: 7, x: 900, y: 1650, width: 140, height: 14 },
    { id: 8, x: 560, y: 1420, width: 150, height: 14 },
    { id: 9, x: 310, y: 1180, width: 160, height: 14 },
    { id: 10, x: 680, y: 950, width: 180, height: 14 },
    { id: 11, x: 480, y: 720, width: 150, height: 14 },
    { id: 12, x: 760, y: 500, width: 170, height: 14 },
  ],

  walls: [
    { id: 1, x: 250, y: 2500, width: 24, height: 400 },
    { id: 2, x: 1050, y: 1900, width: 24, height: 500 },
  ],

  slopes: [
    { id: 1, x: 430, y: 2700, width: 260, height: 90, direction: "downRight" },
    { id: 2, x: 620, y: 1500, width: 260, height: 90, direction: "downLeft" },
  ],

  goal: {
    x: 620,
    y: 220,
    width: 150,
    height: 150,
  },
};