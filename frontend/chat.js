// Connect to Node WebSocket Server
const socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
  console.log("Client connected to AI Chatbot WebSocket");
};

socket.onmessage = (event) => {
  const response = JSON.parse(event.data);
  appendMessage('Bot', response.text);

  if (response.action === "NAVIGATE_MECH") {
    appendActionButton("Open Map Direction", () => {
      window.location.href = "map.html";
    });
  }
};

function sendUserQuery(text) {
  const lang = document.getElementById('langSelect') ? document.getElementById('langSelect').value : 'en';
  appendMessage('You', text);
  
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ text: text, language: lang }));
  } else {
    appendMessage('System', 'WebSocket is offline. Run "node server.js" in your terminal.');
  }
}

function handleManualSend() {
  const input = document.getElementById('userInput');
  if (input.value.trim() !== '') {
    sendUserQuery(input.value);
    input.value = '';
  }
}

function appendMessage(sender, text) {
  const chatBox = document.getElementById('chatContainer');
  if (!chatBox) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = sender === 'You' 
    ? 'bg-blue-600 text-white p-3 rounded-lg text-sm max-w-md ml-auto' 
    : 'bg-slate-200 text-slate-800 p-3 rounded-lg text-sm max-w-md';
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
  
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendActionButton(label, onClickAction) {
  const chatBox = document.getElementById('chatContainer');
  const btn = document.createElement('button');
  btn.className = "mt-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg block transition";
  btn.innerText = label;
  btn.onclick = onClickAction;
  chatBox.appendChild(btn);
}

// Browser Web Speech Recognition Integration
function toggleVoice() {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    const lang = document.getElementById('langSelect').value;
    
    recognition.lang = lang === 'mr' ? 'mr-IN' : 'en-US';

    recognition.onstart = () => {
      document.getElementById('micBtn').classList.add('bg-red-600');
    };

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      sendUserQuery(speechText);
    };

    recognition.onend = () => {
      document.getElementById('micBtn').classList.remove('bg-red-600');
    };

    recognition.start();
  } else {
    alert("Speech recognition is not supported on this browser.");
  }
}
