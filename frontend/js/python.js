const messagesContainer = document.getElementById("messagesContainer");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const versionSelect = document.getElementById("versionSelect");
const themeSelect = document.getElementById("themeSelect");
const animatedText = document.getElementById("animatedText");
const serverWakeup = document.getElementById("serverWakeup");

let currentVersion = "v1.0";

// --- Escape HTML for safety ---
function escapeHTML(str) {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// --- ChatGPT-style typing for AI messages ---
function typeAIMessage(text, isCode = false) {
  const msgDiv = document.createElement("div");
  msgDiv.className = "chat-message left";
  messagesContainer.appendChild(msgDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  if (isCode) {
    // Show code immediately with syntax highlight
    msgDiv.innerHTML = `
      <strong>PYCODE:</strong> Here is your code output:<br>
      <pre><code class="language-python">${escapeHTML(text)}</code></pre>
    `;
    setTimeout(() => {
      msgDiv.querySelectorAll("code").forEach(el => hljs.highlightElement(el));
    }, 50);
  } else {
    // Typing animation for plain text
    let i = 0;
    function typeChar() {
      if (i <= text.length) {
        msgDiv.textContent = "PYCODE: " + text.substring(0, i);
        i++;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        setTimeout(typeChar, 20);
      }
    }
    typeChar();
  }
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

// --- v1.5: Python execution with server wake-up ---
async function handleV15(code) {
  try {
    serverWakeup.style.display = "flex"; // Show server container
    const response = await fetch("https://pycode-server.onrender.com/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });

    const data = await response.json();
    return data?.output || "PYCODE: No output returned";
  } catch (err) {
    console.error(err);
    return "PYCODE: Error executing code";
  } finally {
    serverWakeup.style.display = "none"; // Hide after response
  }
}

// --- Get AI response ---
async function getResponse(message) {
  if (currentVersion === "v1.0") return handleV1(message);
  else if (currentVersion === "v1.5") return await handleV15(message);
  else return "This version is not supported yet.";
}

// --- Send message handler ---
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addUserMessage(message);
  userInput.value = "";

  const response = await getResponse(message);
  typeAIMessage(response, currentVersion === "v1.5");
}

// --- Event listeners ---
sendBtn.addEventListener("click", sendMessage);

// Shift+Enter multi-line support
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

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
  if (charIndex === 0) {
    animatedText.textContent = ""; // reset
  }
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
    animatedText.textContent = texts[textIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(eraseEffect, 50);
  } else {
    textIndex = (textIndex + 1) % texts.length;
    setTimeout(typeEffect, 500);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (texts.length) typeEffect();
});
