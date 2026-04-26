export const level1 = {
  name: "Level 1: Network Basics",
  worldHeight: 5000,
  spawnPlatformId: 1,

  platforms: [
    // Spawn / early climb
    { id: 1, x: 420, y: 3000, width: 520, height: 14 },
    { id: 2, x: 860, y: 9480, width: 220, height: 14 },
    { id: 3, x: 520, y: 9250, width: 170, height: 14 },
    { id: 4, x: 250, y: 9020, width: 240, height: 14 },
    { id: 5, x: 660, y: 8780, width: 140, height: 14 },
    { id: 6, x: 930, y: 8560, width: 190, height: 14 },

    // Safe ledge 1
    { id: 7, x: 300, y: 8300, width: 620, height: 18 },
    { id: 8, x: 1040, y: 8100, width: 130, height: 14 },
    { id: 9, x: 780, y: 7880, width: 150, height: 14 },
    { id: 10, x: 470, y: 7660, width: 120, height: 14 },
    { id: 11, x: 170, y: 7440, width: 160, height: 14 },

    // Mid climb with mixed platform sizes
    { id: 12, x: 500, y: 7190, width: 300, height: 14 },
    { id: 13, x: 900, y: 6950, width: 150, height: 14 },
    { id: 14, x: 640, y: 6710, width: 100, height: 14 },
    { id: 15, x: 320, y: 6480, width: 210, height: 14 },
    { id: 16, x: 760, y: 6240, width: 180, height: 14 },

    // Safe ledge 2
    { id: 17, x: 180, y: 5980, width: 760, height: 18 },
    { id: 18, x: 1020, y: 5740, width: 150, height: 14 },
    { id: 19, x: 740, y: 5520, width: 130, height: 14 },
    { id: 20, x: 450, y: 5300, width: 120, height: 14 },
    { id: 21, x: 160, y: 5070, width: 140, height: 14 },

    // Slightly harder section
    { id: 22, x: 420, y: 4820, width: 180, height: 14 },
    { id: 23, x: 760, y: 4580, width: 110, height: 14 },
    { id: 24, x: 1010, y: 4350, width: 120, height: 14 },
    { id: 25, x: 700, y: 4120, width: 150, height: 14 },
    { id: 26, x: 360, y: 3890, width: 100, height: 14 },

    // Safe ledge 3
    { id: 27, x: 250, y: 3620, width: 700, height: 18 },
    { id: 28, x: 930, y: 3380, width: 180, height: 14 },
    { id: 29, x: 620, y: 3160, width: 120, height: 14 },
    { id: 30, x: 270, y: 2920, width: 150, height: 14 },

    // Upper climb
    { id: 31, x: 560, y: 2670, width: 220, height: 14 },
    { id: 32, x: 880, y: 2440, width: 120, height: 14 },
    { id: 33, x: 620, y: 2210, width: 100, height: 14 },
    { id: 34, x: 300, y: 1980, width: 140, height: 14 },
    { id: 35, x: 650, y: 1740, width: 160, height: 14 },
    { id: 36, x: 970, y: 1510, width: 130, height: 14 },

    // Final safe ledge
    { id: 37, x: 280, y: 1260, width: 760, height: 18 },
    { id: 38, x: 720, y: 1010, width: 170, height: 14 },
    { id: 39, x: 430, y: 790, width: 120, height: 14 },
    { id: 40, x: 690, y: 560, width: 100, height: 14 },
    { id: 41, x: 520, y: 340, width: 230, height: 14 },
  ],

  walls: [
    // Lower area blockers
    { id: 1, x: 180, y: 8700, width: 24, height: 500 },
    { id: 2, x: 1120, y: 7600, width: 24, height: 650 },

    // Mid area blockers
    { id: 3, x: 120, y: 6000, width: 24, height: 600 },
    { id: 4, x: 1080, y: 4700, width: 24, height: 700 },

    // Upper area blockers
    { id: 5, x: 160, y: 2850, width: 24, height: 550 },
    { id: 6, x: 1120, y: 1600, width: 24, height: 500 },
  ],

  slopes: [
    { id: 1, x: 620, y: 9360, width: 280, height: 90, direction: "downRight" },
    { id: 2, x: 300, y: 8100, width: 320, height: 100, direction: "downLeft" },
    { id: 3, x: 650, y: 5750, width: 300, height: 90, direction: "downRight" },
    { id: 4, x: 260, y: 3440, width: 300, height: 90, direction: "downLeft" },
    { id: 5, x: 740, y: 1230, width: 260, height: 80, direction: "downRight" },
  ],

  goal: {
    x: 560,
    y: 120,
    width: 160,
    height: 160,
  },
};