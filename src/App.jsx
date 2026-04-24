import { useState } from "react";
import "./App.css";

const scenarios = [
  {
    title: "Level 1: DNS Is Fake Apparently",
    intro:
      "Users say the internet is down. You suspect DNS because pinging IPs still works.",
    goal: "Fix DNS so users can reach google.com.",
    correctCommand: "set dns 8.8.8.8",
    hints: ["Try: ping 8.8.8.8", "Try: nslookup google.com"],
  },
  {
    title: "Level 2: DHCP Took The Day Off",
    intro:
      "A workstation has no valid IP address. It assigned itself a weird 169.254 address.",
    goal: "Renew the workstation IP address.",
    correctCommand: "ipconfig /renew",
    hints: ["Try: ipconfig", "The client needs a new DHCP lease."],
  },
  {
    title: "Level 3: Gateway? Never Heard Of Her",
    intro:
      "The PC has an IP and DNS, but it cannot reach anything outside the local network.",
    goal: "Set the correct default gateway.",
    correctCommand: "set gateway 192.168.1.1",
    hints: ["Try: route print", "Something is wrong with the default gateway."],
  },
];

function App() {
  const [level, setLevel] = useState(0);
  const [input, setInput] = useState("");
  const [log, setLog] = useState([
    "Network 2: Rewired",
    '"The network was fixed once. It did not stay that way."',
    "",
    "Type help to begin.",
  ]);

  const scenario = scenarios[level];

  function runCommand(commandRaw) {
    const command = commandRaw.trim().toLowerCase();
    const newLog = [...log, `> ${commandRaw}`];

    if (command === "help") {
      newLog.push(
        "",
        "Available commands:",
        "help",
        "status",
        "hint",
        "ping 8.8.8.8",
        "nslookup google.com",
        "ipconfig",
        "ipconfig /renew",
        "route print",
        "set dns 8.8.8.8",
        "set gateway 192.168.1.1",
        ""
      );
    } else if (command === "status") {
      newLog.push("", scenario.title, scenario.intro, `Goal: ${scenario.goal}`, "");
    } else if (command === "hint") {
      newLog.push("", ...scenario.hints, "");
    } else if (command === "ping 8.8.8.8") {
      newLog.push("", "Reply from 8.8.8.8: bytes=32 time=24ms TTL=117", "");
    } else if (command === "nslookup google.com") {
      if (level === 0) {
        newLog.push("", "DNS request failed. Server not responding.", "");
      } else {
        newLog.push("", "Name: google.com", "Address: 142.250.190.78", "");
      }
    } else if (command === "ipconfig") {
      if (level === 1) {
        newLog.push(
          "",
          "IPv4 Address: 169.254.44.10",
          "Subnet Mask: 255.255.0.0",
          "Default Gateway:",
          ""
        );
      } else {
        newLog.push(
          "",
          "IPv4 Address: 192.168.1.25",
          "Subnet Mask: 255.255.255.0",
          "Default Gateway: 192.168.1.1",
          ""
        );
      }
    } else if (command === "route print") {
      if (level === 2) {
        newLog.push("", "Default Gateway: 0.0.0.0", "That looks extremely cursed.", "");
      } else {
        newLog.push("", "Routes look normal.", "");
      }
    } else if (command === scenario.correctCommand) {
      newLog.push("", "Fix applied successfully.", "Network gremlin defeated.", "");

      if (level + 1 < scenarios.length) {
        newLog.push(`Next level unlocked: ${scenarios[level + 1].title}`, "");
        setLevel(level + 1);
      } else {
        newLog.push(
          "YOU WIN.",
          "The network is stable. For now.",
          "Network 3 will probably ruin everything.",
          ""
        );
      }
    } else {
      newLog.push("", "Command not recognized or not useful here.", "Try help or hint.", "");
    }

    setLog(newLog);
    setInput("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    runCommand(input);
  }

  return (
    <main className="game-page">
      <section className="terminal">
        <div className="terminal-header">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
          <p>network-2-rewired.exe</p>
        </div>

        <div className="terminal-body">
          <div className="mission-box">
            <h1>{scenario.title}</h1>
            <p>{scenario.intro}</p>
            <p>
              <strong>Goal:</strong> {scenario.goal}
            </p>
          </div>

          <div className="log">
            {log.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="command-line">
            <span>&gt;</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              placeholder="type a command..."
            />
          </form>
        </div>
      </section>
    </main>
  );
}

export default App;