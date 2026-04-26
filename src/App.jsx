import { useEffect, useRef, useState } from "react";
import "./App.css";

const QUESTION = {
  text: "What port does HTTPS usually use?",
  answers: [
    { text: "443", result: "green" },
    { text: "80", result: "yellow" },
    { text: "21", result: "red" },
  ],
};

const SETTINGS = {
  green: { label: "OPTIMAL", maxChargeMs: 2000 },
  yellow: { label: "DEGRADED", maxChargeMs: 5000 },
  red: { label: "UNSTABLE", maxChargeMs: null },
};

const PLAYER_SIZE = 28;

const platforms = [
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
];

const walls = [
  { id: 1, x: 250, y: 2500, width: 24, height: 400 },
  { id: 2, x: 1050, y: 1900, width: 24, height: 500 },
];

const slopes = [
  { id: 1, x: 430, y: 2700, width: 260, height: 90, direction: "downRight" },
  { id: 2, x: 620, y: 1500, width: 260, height: 90, direction: "downLeft" },
];

const goal = {
  x: 620,
  y: 220,
  width: 180,
  height: 45,
};

const BASE = import.meta.env.BASE_URL;
const WORLD_HEIGHT = 3200;
const CAMERA_DEAD_ZONE_Y = 280;

function App() {
  const [cameraY, setCameraY] = useState(WORLD_HEIGHT - window.innerHeight);
  const cameraYRef = useRef(WORLD_HEIGHT - window.innerHeight);
  const [screen, setScreen] = useState("pre");
  const [showQuestion, setShowQuestion] = useState(false);
  const [won, setWon] = useState(false);

  const [player, setPlayer] = useState({
    x: 600,
    y: WORLD_HEIGHT - 40,
    vx: 0,
    vy: 0,
    grounded: true,
  });

  const [answerState, setAnswerState] = useState(null);
  const [maxChargeMs, setMaxChargeMs] = useState(3000);
  const [chargeMs, setChargeMs] = useState(0);

  
  const audioRef = useRef(null);
  const startAudioRef = useRef(null);

  const [deaths, setDeaths] = useState(0);
  const deathAudioRef = useRef(null);


  const keys = useRef({});
  const playerRef = useRef(player);
  const chargingRef = useRef(false);
  const chargeRef = useRef(0);
  const maxChargeRef = useRef(maxChargeMs);
  const screenRef = useRef(screen);
  const showQuestionRef = useRef(showQuestion);
  const answerStateRef = useRef(answerState);
  const wonRef = useRef(won);

  useEffect(() => {
  cameraYRef.current = cameraY;
}, [cameraY]);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    maxChargeRef.current = maxChargeMs;
  }, [maxChargeMs]);

  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);

  useEffect(() => {
    showQuestionRef.current = showQuestion;
  }, [showQuestion]);

  useEffect(() => {
    answerStateRef.current = answerState;
  }, [answerState]);

  useEffect(() => {
    wonRef.current = won;
  }, [won]);

  function playMenuMusic() {
    if (!startAudioRef.current) return;

    startAudioRef.current.volume = 0.4;
    startAudioRef.current.play().catch((e) => console.log(e));
  }

  function playGameMusic() {
    if (!audioRef.current) return;

    audioRef.current.volume = 0.4;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((e) => console.log(e));
  }

  function stopMenuMusic() {
    if (!startAudioRef.current) return;

    startAudioRef.current.pause();
    startAudioRef.current.currentTime = 0;
  }

  function stopGameMusic() {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }

 function startGame() {
  setCameraY(WORLD_HEIGHT - window.innerHeight);
  cameraYRef.current = WORLD_HEIGHT - window.innerHeight;

  stopMenuMusic();
  setScreen("game");
  setShowQuestion(true);
  setWon(false);
  setAnswerState(null);
  setChargeMs(0);
  chargeRef.current = 0;

  setTimeout(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => console.log(e));
    }
  }, 0);

    const spawnPlatform = platforms[0];

    const startingPlayer = {
      x: spawnPlatform.x + spawnPlatform.width / 2,
      y: spawnPlatform.y - PLAYER_SIZE / 2,
      vx: 0,
      vy: 0,
      grounded: true,
    };

  setPlayer(startingPlayer);
  playerRef.current = startingPlayer;
}

function respawnPlayer() {
  const deathSound = new Audio(`${BASE}audio/dial.mp3`);
  deathSound.volume = 0.7;
  deathSound.play().catch((e) => console.log(e));

  setDeaths((count) => count + 1);

  const spawnPlatform = platforms[0];

  const respawnedPlayer = {
    x: spawnPlatform.x + spawnPlatform.width / 2,
    y: spawnPlatform.y - PLAYER_SIZE / 2,
    vx: 0,
    vy: 0,
    grounded: true,
  };

  setPlayer(respawnedPlayer);
  playerRef.current = respawnedPlayer;

  setCameraY(WORLD_HEIGHT - window.innerHeight);
  cameraYRef.current = WORLD_HEIGHT - window.innerHeight;

  chargingRef.current = false;
  chargeRef.current = 0;
  setChargeMs(0);
}

  function backToStart() {
    stopGameMusic();
    setScreen("start");
  }

  function chooseAnswer(result) {
    setAnswerState(result);
    setShowQuestion(false);

    if (result === "green") {
      setMaxChargeMs(950);
    }

    if (result === "yellow") {
      setMaxChargeMs(5000);
    }
    

    if (result === "red") {
      const cursedCharge = Math.floor(Math.random() * 29000) + 1000;
      setMaxChargeMs(cursedCharge);
    }

    setChargeMs(0);
    chargeRef.current = 0;
  }


  function releaseJump() {
    const p = playerRef.current;

if (
      showQuestionRef.current ||
      screenRef.current !== "game" ||
      !answerStateRef.current ||
      wonRef.current ||
      !chargingRef.current
    ) {
      return;
    }

   const power = Math.min(chargeRef.current / maxChargeRef.current, 1);
const jumpPower = 7 + power * 8;

let horizontalPower = 0;

if (keys.current.ArrowLeft || keys.current.KeyA) {
  horizontalPower = -14;
}

if (keys.current.ArrowRight || keys.current.KeyD) {
  horizontalPower = 14;
}

const nextPlayer = {
  ...p,
  vx: horizontalPower * power,
  vy: -jumpPower,
  grounded: false,
};

    setPlayer(nextPlayer);
    playerRef.current = nextPlayer;

    chargingRef.current = false;
    chargeRef.current = 0;
    setChargeMs(0);
  }

  function checkGoalCollision(p) {
    return (
      p.x + PLAYER_SIZE / 2 > goal.x &&
      p.x - PLAYER_SIZE / 2 < goal.x + goal.width &&
      p.y + PLAYER_SIZE / 2 > goal.y &&
      p.y - PLAYER_SIZE / 2 < goal.y + goal.height
    );
  }

function handlePlatformCollision(oldP, newP) {
  let p = { ...newP };

  for (const platform of platforms) {
    const playerLeft = p.x - PLAYER_SIZE / 2;
    const playerRight = p.x + PLAYER_SIZE / 2;
    const playerTop = p.y - PLAYER_SIZE / 2;
    const playerBottom = p.y + PLAYER_SIZE / 2;

    const oldLeft = oldP.x - PLAYER_SIZE / 2;
    const oldRight = oldP.x + PLAYER_SIZE / 2;
    const oldTop = oldP.y - PLAYER_SIZE / 2;
    const oldBottom = oldP.y + PLAYER_SIZE / 2;

    const overlaps =
      playerRight > platform.x &&
      playerLeft < platform.x + platform.width &&
      playerBottom > platform.y &&
      playerTop < platform.y + platform.height;

    if (!overlaps) continue;

    // Land on top
    if (oldBottom <= platform.y) {
      p.y = platform.y - PLAYER_SIZE / 2;
      p.vy = 0;
      p.grounded = true;
    }

    // Hit underside
    else if (oldTop >= platform.y + platform.height) {
      p.y = platform.y + platform.height + PLAYER_SIZE / 2;
      p.vy = 0;
    }

    // Hit left side
    else if (oldRight <= platform.x) {
      p.x = platform.x - PLAYER_SIZE / 2;
      p.vx = -Math.abs(p.vx) * 0.4;
    }

    // Hit right side
    else if (oldLeft >= platform.x + platform.width) {
      p.x = platform.x + platform.width + PLAYER_SIZE / 2;
      p.vx = Math.abs(p.vx) * 0.4;
    }
  }

  return p;
}

function handleWallCollision(oldP, newP) {
  let p = { ...newP };

  for (const wall of walls) {
    const playerTop = p.y - PLAYER_SIZE / 2;
    const playerBottom = p.y + PLAYER_SIZE / 2;
    const playerLeft = p.x - PLAYER_SIZE / 2;
    const playerRight = p.x + PLAYER_SIZE / 2;

    const overlaps =
      playerRight > wall.x &&
      playerLeft < wall.x + wall.width &&
      playerBottom > wall.y &&
      playerTop < wall.y + wall.height;

    if (overlaps) {
      // came from left → hit left side of wall
      if (oldP.x < wall.x) {
        p.x = wall.x - PLAYER_SIZE / 2;

        // 🔥 bounce right → left
        p.vx = -Math.abs(p.vx) * 0.8;
      } else {
        // came from right → hit right side
        p.x = wall.x + wall.width + PLAYER_SIZE / 2;

        // 🔥 bounce left → right
        p.vx = Math.abs(p.vx) * 0.8;
      }
    }
  }

  return p;
}

function handleSlopeCollision(oldP, newP) {
  let p = { ...newP };

  for (const slope of slopes) {
    const playerBottom = p.y + PLAYER_SIZE / 2;
    const playerTop = p.y - PLAYER_SIZE / 2;
    const oldBottom = oldP.y + PLAYER_SIZE / 2;
    const oldTop = oldP.y - PLAYER_SIZE / 2;

    const playerLeft = p.x - PLAYER_SIZE / 2;
    const playerRight = p.x + PLAYER_SIZE / 2;

    const overlappingX =
      playerRight > slope.x &&
      playerLeft < slope.x + slope.width;

    if (!overlappingX) continue;

    const t = (p.x - slope.x) / slope.width;

    let surfaceY;

    if (slope.direction === "downRight") {
      surfaceY = slope.y + t * slope.height;
    } else {
      surfaceY = slope.y + (1 - t) * slope.height;
    }

    // block jumping up through the diagonal platform
    const hitUnderside =
      oldTop >= surfaceY &&
      playerTop <= surfaceY &&
      p.vy < 0;

    if (hitUnderside) {
      p.y = surfaceY + PLAYER_SIZE / 2;
      p.vy = 0;
      return p;
    }

    const distance = playerBottom - surfaceY;

    if (
      p.vy >= -2 &&
      distance >= -4 &&
      distance <= 12
    ) {
      p.y = surfaceY - PLAYER_SIZE / 2;
      p.grounded = true;
      p.vy = 0;

      const dir = slope.direction === "downRight" ? 1 : -1;
      const slideSpeed = 1.2;

      p.vx = p.vx * 0.7 + dir * slideSpeed;
    }
  }

  return p;
}

  useEffect(() => {
    function keyDown(e) {
      keys.current[e.code] = true;

      if (
        e.code === "Space" &&
        playerRef.current.grounded &&
        !chargingRef.current &&
        screenRef.current === "game" &&
        !showQuestionRef.current &&
        answerStateRef.current &&
        !wonRef.current
      ) {
        e.preventDefault();
        chargingRef.current = true;
        chargeRef.current = 0;
        setChargeMs(0);
      }
    }

    function keyUp(e) {
      keys.current[e.code] = false;

      if (e.code === "Space") {
        e.preventDefault();
        releaseJump();
      }
    }

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, []);

  useEffect(() => {
    let lastTime = performance.now();
    let animationId;

    function gameLoop(time) {
      const delta = time - lastTime;
      lastTime = time;

      if (screenRef.current !== "game" || wonRef.current) {
        animationId = requestAnimationFrame(gameLoop);
        return;
      }

      const oldP = { ...playerRef.current };
      let p = { ...playerRef.current };

if (p.grounded) {
  p.vx *= 0.92;   // light friction so slopes can still move you
} else {
  p.vx *= 0.995;  // slight air drag
}
      if (!p.grounded) {
        p.vy += 0.22;
    }

      p.x += p.vx;
      p.y += p.vy;

      p.grounded = false;

      if (p.x < PLAYER_SIZE / 2) {
        p.x = PLAYER_SIZE / 2;
        p.vx = 0;
      }

      if (p.x > window.innerWidth - PLAYER_SIZE / 2) {
        p.x = window.innerWidth - PLAYER_SIZE / 2;
        p.vx = 0;
      }
      p = handlePlatformCollision(oldP, p);
      p = handleSlopeCollision(oldP, p);
      p = handleWallCollision(oldP, p);

      // allow holding SPACE before landing to start charging once grounded
if (
  p.grounded &&
  keys.current.Space &&
  !chargingRef.current &&
  !showQuestionRef.current &&
  answerStateRef.current &&
  !wonRef.current
) {
  chargingRef.current = true;
  chargeRef.current = 0;
  setChargeMs(0);
}

      // 🔥 APPLY SLOPE SLIDE HERE (correct place)
if (p.onSlope && p.grounded) {
  const dir = p.onSlope === "downRight" ? 1 : -1;

  const slideSpeed = 1.8;

  p.vx += dir * slideSpeed;
  p.vy += 0.3; // keeps player glued to slope
}

if (p.y > WORLD_HEIGHT + 100) {
  respawnPlayer();
  animationId = requestAnimationFrame(gameLoop);
  return;
}

      if (checkGoalCollision(p)) {
        setWon(true);
        wonRef.current = true;
      }

    let nextCameraY = cameraYRef.current;
            const playerScreenY = p.y - nextCameraY;

            // Follow upward
            if (playerScreenY < CAMERA_DEAD_ZONE_Y) {
              nextCameraY = p.y - CAMERA_DEAD_ZONE_Y;
            }

            // Follow downward when falling
            if (playerScreenY > window.innerHeight - 260) {
              nextCameraY = p.y - (window.innerHeight - 260);
            }

            nextCameraY = Math.max(
              0,
              Math.min(nextCameraY, WORLD_HEIGHT - window.innerHeight)
            );

            cameraYRef.current = nextCameraY;
            setCameraY(nextCameraY);

      playerRef.current = p;
      setPlayer(p);

      if (chargingRef.current) {
        chargeRef.current += delta;
        setChargeMs(chargeRef.current);
      }

      animationId = requestAnimationFrame(gameLoop);
    }

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const chargePercent = Math.min((chargeMs / maxChargeMs) * 100, 100);

  if (screen === "pre") {
  return (
    <main
      className="start-screen"
      onClick={() => {
        playMenuMusic();
        setScreen("start");
      }}
    >
      <video
        className="bg-video"
        src={`${BASE}video/starty.mp4`}
        autoPlay
        loop
        muted
        playsInline
      />

      <audio ref={startAudioRef} src={`${BASE}audio/ironclad.mp3`} loop />
      <audio
          ref={audioRef}
          src={`${BASE}audio/chrometempest.mp3`}
          loop
          preload="auto"
        />

      <div className="start-card">
        <h1>Network 2: Rewired</h1>
        <p>Click anywhere to start</p>
      </div>
    </main>
  );
}

  if (screen === "start") {
    return (
      <main className="start-screen" onClick={playMenuMusic}>
        <video
          className="bg-video"
          src={`${BASE}video/starty.mp4`}
          autoPlay
          loop
          muted
          playsInline
        />

        <audio ref={startAudioRef} src={`${BASE}audio/ironclad.mp3`} loop />
        <audio ref={audioRef} src={`${BASE}audio/chrometempest.mp3`} loop />
        <audio ref={deathAudioRef} src={`${BASE}audio/dial.mp3`} preload="auto" />



        <div className="start-card">
          <h1>Network 2: Rewired</h1>
          <p>The network was fixed once. It did not stay that way.</p>

          <button onClick={startGame}>Play</button>
          <button onClick={() => setScreen("how")}>How to Play</button>
        </div>
      </main>
    );
  }

  if (screen === "how") {
    return (
      <main className="start-screen" onClick={playMenuMusic}>
        <video
          className="bg-video"
          src={`${BASE}video/starty.mp4`}
          autoPlay
          loop
          muted
          playsInline
        />

        <audio ref={startAudioRef} src={`${BASE}audio/ironclad.mp3`} loop />
        <audio ref={audioRef} src={`${BASE}audio/chrometempest.mp3`} loop />

        <div className="start-card">
          <h1>How to Play</h1>
          <p>Answer networking questions to control how your jump charges.</p>
          <p>Optimal = 3 second full charge.</p>
          <p>Degraded = 10 second full charge.</p>
          <p>Unstable = random full charge between 1 and 30 seconds.</p>
          <p>Move with A / D or arrow keys. Hold SPACE to charge. Release SPACE to jump.</p>

          <button onClick={startGame}>Play</button>
          <button onClick={() => setScreen("start")}>Back</button>
        </div>
      </main>
    );
  }

  return (
    <main className="game">
      
    <div className="death-counter">
      ERRORS: {deaths.toString(2).padStart(8, "0")}
    </div>

      <video
        className="bg-video"
        src={`${BASE}video/spacehole.mp4`}
        autoPlay
        loop
        muted
        playsInline
      />

      <audio ref={audioRef} src={`${BASE}audio/chrometempest.mp3`} loop />

      <div
        className="goal"
        style={{
          left: goal.x,
          top: goal.y - cameraY,
          width: goal.width,
          height: goal.height,
        }}
      >
        GOAL
      </div>

{platforms.map((platform) => (
  <img
    key={platform.id}
    src={`${BASE}Models/switcher.webp`}
    className="platform"
    style={{
      position: "absolute",
      left: platform.x,
      top: platform.y - cameraY,
      width: platform.width,
      height: platform.height,
      objectFit: "cover",
      pointerEvents: "none",
    }}
  />
))}

{walls.map((wall) => (
  <img
    key={wall.id}
    src={`${BASE}Models/switcher.webp`}
    style={{
      position: "absolute",
      left: wall.x,
      top: wall.y - cameraY,
      width: wall.height,
      height: wall.width,
      objectFit: "cover",
      transform: "rotate(90deg) translateY(-100%)",
      transformOrigin: "top left",
      pointerEvents: "none",
    }}
  />
))}

{slopes.map((slope) => (
  <img
    key={slope.id}
    src={`${BASE}Models/switcher.webp`}
    style={{
      position: "absolute",
      left: slope.x,
      top: slope.y - cameraY,
      width: slope.width,
      height: slope.height, // ✅ MATCH REAL SIZE
      transform: `rotate(${slope.direction === "downRight" ? 25 : -25}deg)`,
      transformOrigin: "center",
      pointerEvents: "none",
    }}
  />
))}

      {answerState && (
        <div
          className={`player-indicator ${answerState}`}
          style={{
            left: player.x,
            top: player.y - cameraY - 58,
          }}
        >
          {SETTINGS[answerState].label}
        </div>
      )}

      {answerState && (
        <div
          className={`charge-bar ${answerState}`}
          style={{
            left: player.x - 35,
            top: player.y - cameraY - 38,
          }}
        >
          <div style={{ width: `${chargePercent}%` }}></div>
        </div>
      )}

 <img
  src={`${BASE}Models/rjcuteyes.jpg`}
  className="player"
  style={{
    position: "absolute",
    left: player.x,
    top: player.y - cameraY - 6,
    width: 40,
    height: 40,
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
  }}
/>

      {showQuestion && (
        <div className="question-overlay">
          <div className="question-modal">
            <h2>{QUESTION.text}</h2>

            <div className="answers">
              {QUESTION.answers.map((answer) => (
                <button key={answer.text} onClick={() => chooseAnswer(answer.result)}>
                  {answer.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {won && (
        <div className="question-overlay">
          <div className="question-modal">
            <h2>You Win</h2>
            <p>The network survived. Somehow.</p>
            <button onClick={startGame}>Play Again</button>
            <button onClick={backToStart}>Main Menu</button>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;