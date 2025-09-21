const messagesContainer = document.getElementById("messagesContainer");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const versionSelect = document.getElementById("versionSelect");
const themeSelect = document.getElementById("themeSelect");
const animatedText = document.getElementById("animatedText");

let currentVersion = "v1.0";

// --- ChatGPT-style typing for AI messages ---
function typeAIMessage(text, isCode = false) {
  const msgDiv = document.createElement("div");
  msgDiv.className = "chat-message left";
  messagesContainer.appendChild(msgDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  let i = 0;
  function typeChar() {
    if (i <= text.length) {
      if (isCode) {
        msgDiv.innerHTML = `<strong>PYCODE:</strong> Here is the code you asked for<br><div class="pycode-container">${text.substring(0, i)}</div>`;
      } else {
        msgDiv.textContent = "PYCODE: " + text.substring(0, i);
      }
      i++;
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      setTimeout(typeChar, 20);
    }
  }
  typeChar();
}

// --- Add user message ---
function addUserMessage(text) {
  const msgDiv = document.createElement("div");
  msgDiv.className = "chat-message right";
  msgDiv.textContent = "You: " + text;
  messagesContainer.appendChild(msgDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// --- v1.0 static Python help ---
function handleV1(message) {
  const msg = message.toLowerCase();
  if (msg.includes("numpy")) {
    return `NumPy is the fundamental package for scientific computing with Python.

• numpy.array: Creates an array from object.
  import numpy as np
  arr = np.array([1, 2, 3])
• numpy.zeros: Creates array of zeros.
  arr = np.zeros((3, 3))
• numpy.ones: Creates array of ones.
  arr = np.ones((3, 3))`;
  } else if (msg.includes("pandas")) {
    return `Pandas is a powerful data analysis tool.

• pandas.DataFrame
• pandas.read_csv
• pandas.concat
• pandas.merge`;
  } else if (msg.includes("matplotlib")) {
    return `Matplotlib is a plotting library.

• plt.plot
• plt.scatter
• plt.hist
• plt.bar`;
  } else {
    return "I'm PYCODE v1.0. Ask about Python libraries like NumPy, Pandas, or Matplotlib.";
  }
}

// --- v1.5: Piston API ---
async function handleV15(code) {
  try {
    const response = await fetch("https://pycode-proxy.vercel.app/api/piston.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: "python3", code: code })
    });
    const data = await response.json();
    if (data.output) return data.output;
    else return "PYCODE: I'm not able to fetch this code.";
  } catch (err) {
    return "PYCODE: I'm not able to fetch this code.";
  }
}

// --- Get AI response ---
async function getResponse(message) {
  if (currentVersion === "v1.0") return handleV1(message);
  else if (currentVersion === "v1.5") return await handleV15(message);
  else return "This version is not supported yet.";
}

// --- Event listeners ---
sendBtn.addEventListener("click", async () => {
  const message = userInput.value.trim();
  if (!message) return;

  addUserMessage(message);
  userInput.value = "";

  const response = await getResponse(message);
  typeAIMessage(response, currentVersion === "v1.5");
});

userInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendBtn.click(); });

themeSelect.addEventListener("change", () => {
  document.body.className = themeSelect.value + "-mode";
});

versionSelect.addEventListener("change", async () => {
  currentVersion = versionSelect.value;
  messagesContainer.innerHTML = "";
  typeAIMessage("How can I help you today?");
});

// --- Header animated typing ---
const texts = [
  "HELPING THE LOGIC CREATOR",
  "A new era with Python and programming",
  "This snake won't bite you"
];

let textIndex = 0, charIndex = 0;
function typeEffect() {
  if (charIndex < texts[textIndex].length) {
    animatedText.textContent += texts[textIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeEffect, 100);
  } else {
    setTimeout(eraseEffect, 1500);
  }
}
function eraseEffect() {
  if (charIndex > 0) {
    animatedText.textContent = texts[textIndex].substring(0, charIndex);
    charIndex--;
    setTimeout(eraseEffect, 50);
  } else {
    textIndex = (textIndex + 1) % texts.length;
    setTimeout(typeEffect, 500);
  }
}
document.addEventListener("DOMContentLoaded", () => { if (texts.length) typeEffect(); });
