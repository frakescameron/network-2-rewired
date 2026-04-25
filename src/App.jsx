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
  green: {
    label: "GREEN",
    maxChargeMs: 3000,
    message: "Correct. Normal jump charge.",
  },
  yellow: {
    label: "YELLOW",
    maxChargeMs: 9000,
    message: "Close. Slower jump charge.",
  },
  red: {
    label: "RED",
    maxChargeMs: null,
    message: "Wrong. Cursed jump charge.",
  },
};

function App() {
  const [screen, setScreen] = useState("start");
  const [showQuestion, setShowQuestion] = useState(false);

  const [player, setPlayer] = useState({
    x: 600,
    y: 620,
    vx: 0,
    vy: 0,
    grounded: true,
  });

  const [answerState, setAnswerState] = useState(null);
  const [maxChargeMs, setMaxChargeMs] = useState(3000);
  const [message, setMessage] = useState("Answer a question to set your jump behavior.");
  const [charging, setCharging] = useState(false);
  const [chargeMs, setChargeMs] = useState(0);

  const keys = useRef({});
  const playerRef = useRef(player);
  const chargingRef = useRef(false);
  const chargeRef = useRef(0);
  const maxChargeRef = useRef(maxChargeMs);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    chargingRef.current = charging;
  }, [charging]);

  useEffect(() => {
    maxChargeRef.current = maxChargeMs;
  }, [maxChargeMs]);

  function startGame() {
    setScreen("game");
    setShowQuestion(true);
    setAnswerState(null);
    setMessage("Answer the question to unlock your jump.");
  }

  function chooseAnswer(result) {
    setAnswerState(result);
    setShowQuestion(false);

    if (result === "red") {
      const cursedCharge = Math.floor(Math.random() * 10000) + 2000;
      setMaxChargeMs(cursedCharge);
      setMessage(`${SETTINGS.red.message} Full charge is secretly ${Math.round(cursedCharge / 1000)} seconds.`);
    } else {
      setMaxChargeMs(SETTINGS[result].maxChargeMs);
      setMessage(SETTINGS[result].message);
    }

    setChargeMs(0);
    chargeRef.current = 0;
  }

  function releaseJump() {
    const p = playerRef.current;
    if (!p.grounded || showQuestion || screen !== "game" || !answerState) return;

    const power = Math.min(chargeRef.current / maxChargeRef.current, 1);
    const jumpPower = 6 + power * 13;

    setPlayer({
      ...p,
      vy: -jumpPower,
      grounded: false,
    });

    setCharging(false);
    chargingRef.current = false;
    chargeRef.current = 0;
    setChargeMs(0);
  }

  useEffect(() => {
    function keyDown(e) {
      keys.current[e.code] = true;

      if (
        e.code === "Space" &&
        playerRef.current.grounded &&
        !chargingRef.current &&
        screen === "game" &&
        !showQuestion &&
        answerState
      ) {
        e.preventDefault();
        setCharging(true);
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
  }, [screen, showQuestion, answerState]);

  useEffect(() => {
    let lastTime = performance.now();
    let animationId;

    function gameLoop(time) {
      const delta = time - lastTime;
      lastTime = time;

      if (screen !== "game") {
        animationId = requestAnimationFrame(gameLoop);
        return;
      }

      let p = { ...playerRef.current };

      if (!showQuestion) {
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

      if (p.x < 20) {
        p.x = 20;
        p.vx = 0;
      }

      if (p.x > window.innerWidth - 20) {
        p.x = window.innerWidth - 20;
        p.vx = 0;
      }

      if (p.y > window.innerHeight - 40) {
        p.y = window.innerHeight - 40;
        p.vy = 0;
        p.grounded = true;
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
  }, [screen, showQuestion]);

  const chargePercent = Math.min((chargeMs / maxChargeMs) * 100, 100);

  if (screen === "start") {
    return (
      <main className="start-screen">
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
      <main className="start-screen">
        <div className="start-card">
          <h1>How to Play</h1>
          <p>Answer networking questions to control how your jump charges.</p>
          <p>Correct/Green = normal jump. Yellow/Close = slower charge jump. Red/Wrong = cursed random jump.</p>
          <p>Move with A / D or arrow keys. Hold SPACE to charge. Release SPACE to jump.</p>

          <button onClick={startGame}>Play</button>
          <button onClick={() => setScreen("start")}>Back</button>
        </div>
      </main>
    );
  }

  return (
    <main className="game">
      <div className="goal">GOAL</div>

      <div className="platform platform-1"></div>
      <div className="platform platform-2"></div>
      <div className="platform platform-3"></div>

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
    </main>
  );
}

export default App;