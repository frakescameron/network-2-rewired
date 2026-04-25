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
  green: { label: "GREEN", maxChargeMs: 3000 },
  yellow: { label: "YELLOW", maxChargeMs: 10000 },
  red: { label: "RED", maxChargeMs: null },
};

const PLAYER_SIZE = 28;

const platforms = [
  { x: 520, y: 585, width: 180, height: 14 },
  { x: 760, y: 390, width: 160, height: 14 },
  { x: 520, y: 220, width: 160, height: 14 },
];

const goal = {
  x: 650,
  y: 40,
  width: 160,
  height: 40,
};

function App() {
  const [screen, setScreen] = useState("pre");
  const [showQuestion, setShowQuestion] = useState(false);
  const [won, setWon] = useState(false);

  const [player, setPlayer] = useState({
    x: 600,
    y: window.innerHeight - 40,
    vx: 0,
    vy: 0,
    grounded: true,
  });

  const [answerState, setAnswerState] = useState(null);
  const [maxChargeMs, setMaxChargeMs] = useState(3000);
  const [chargeMs, setChargeMs] = useState(0);

  
  const audioRef = useRef(null);
  const startAudioRef = useRef(null);

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

  const startingPlayer = {
    x: 600,
    y: window.innerHeight - 40,
    vx: 0,
    vy: 0,
    grounded: true,
  };

  setPlayer(startingPlayer);
  playerRef.current = startingPlayer;
}

  function backToStart() {
    stopGameMusic();
    setScreen("start");
  }

  function chooseAnswer(result) {
    setAnswerState(result);
    setShowQuestion(false);

    if (result === "green") {
      setMaxChargeMs(3000);
    }

    if (result === "yellow") {
      setMaxChargeMs(10000);
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
      !p.grounded ||
      showQuestionRef.current ||
      screenRef.current !== "game" ||
      !answerStateRef.current ||
      wonRef.current
    ) {
      return;
    }

    const power = Math.min(chargeRef.current / maxChargeRef.current, 1);
    const jumpPower = 6 + power * 13;

    const nextPlayer = {
      ...p,
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
      const playerBottom = p.y + PLAYER_SIZE / 2;
      const oldPlayerBottom = oldP.y + PLAYER_SIZE / 2;

      const playerLeft = p.x - PLAYER_SIZE / 2;
      const playerRight = p.x + PLAYER_SIZE / 2;

      const falling = p.vy >= 0;

      const horizontallyOverlapping =
        playerRight > platform.x && playerLeft < platform.x + platform.width;

      const crossedPlatform =
        oldPlayerBottom <= platform.y && playerBottom >= platform.y;

      if (falling && horizontallyOverlapping && crossedPlatform) {
        p.y = platform.y - PLAYER_SIZE / 2;
        p.vy = 0;
        p.grounded = true;
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

      if (!showQuestionRef.current) {
        if (keys.current.ArrowLeft || keys.current.KeyA) {
          p.vx -= 0.35;
        }

        if (keys.current.ArrowRight || keys.current.KeyD) {
          p.vx += 0.35;
        }
      }

      p.vx *= 0.9;
      p.vy += 0.55;

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

      if (p.y > window.innerHeight - 40) {
        p.y = window.innerHeight - 40;
        p.vy = 0;
        p.grounded = true;
      }

      if (checkGoalCollision(p)) {
        setWon(true);
        wonRef.current = true;
      }

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
        src="/video/start.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      <audio ref={startAudioRef} src="/audio/ironclad.mp3" loop />
      <audio
          ref={audioRef}
          src="/audio/chrometempest.mp3"
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
          src="/video/start.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        <audio ref={startAudioRef} src="/audio/ironclad.mp3" loop />
        <audio ref={audioRef} src="/audio/chrometempest.mp3" loop />

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
          src="/video/start.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        <audio ref={startAudioRef} src="/audio/ironclad.mp3" loop />
        <audio ref={audioRef} src="/audio/chrometempest.mp3" loop />

        <div className="start-card">
          <h1>How to Play</h1>
          <p>Answer networking questions to control how your jump charges.</p>
          <p>Green = 3 second full charge.</p>
          <p>Yellow = 10 second full charge.</p>
          <p>Red = random full charge between 1 and 30 seconds.</p>
          <p>Move with A / D or arrow keys. Hold SPACE to charge. Release SPACE to jump.</p>

          <button onClick={startGame}>Play</button>
          <button onClick={() => setScreen("start")}>Back</button>
        </div>
      </main>
    );
  }

  return (
    <main className="game">
      <video
        className="bg-video"
        src="/video/spacehole.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      <audio ref={audioRef} src="/audio/chrometempest.mp3" loop />

      <div
        className="goal"
        style={{
          left: goal.x,
          top: goal.y,
          width: goal.width,
          height: goal.height,
        }}
      >
        GOAL
      </div>

      {platforms.map((platform, index) => (
        <div
          key={index}
          className="platform"
          style={{
            left: platform.x,
            top: platform.y,
            width: platform.width,
            height: platform.height,
          }}
        ></div>
      ))}

      {answerState && (
        <div
          className={`player-indicator ${answerState}`}
          style={{
            left: player.x,
            top: player.y - 58,
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
            top: player.y - 38,
          }}
        >
          <div style={{ width: `${chargePercent}%` }}></div>
        </div>
      )}

      <div
        className="player"
        style={{
          left: player.x,
          top: player.y,
        }}
      ></div>

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