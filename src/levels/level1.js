export const level1 = {
  name: "Level 1: Patch Panel Panic",
  worldHeight: 3200,
  spawnPlatformId: 1,

  platforms: [
    { id: 1, x: 520, y: 3000, width: 400, height: 14 },
    { id: 2, x: 760, y: 2800, width: 180, height: 14 },
  ],

  slopes: [
    { id: 1, x: 430, y: 2700, width: 260, height: 90, direction: "downRight" },
  ],

  walls: [
    { id: 1, x: 250, y: 2500, width: 24, height: 400 },
  ],

  goal: {
    x: 620,
    y: 220,
    width: 180,
    height: 45,
  },
};