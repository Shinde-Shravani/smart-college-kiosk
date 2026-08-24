// Run 'npm install ws' before executing this file
const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });
console.log("AI Chatbot WebSocket Server online at ws://localhost:8080");

const knowledgeBase = [
  {
    keywords: ["mechanical", "मेकॅनिकल"],
    replyEn: "The Mechanical Engineering Department is in Academic Building - 2, Ground Floor.",
    replyMr: "मेकॅनिकल इंजिनिअरिंग विभाग ॲकॅडमिक बिल्डिंग - २ च्या तळमजल्यावर आहे.",
    action: "NAVIGATE_MECH"
  },
  {
    keywords: ["counseling", "काउंसलिंग", "सल्ला"],
    replyEn: "Student Counseling Support provides Academic and Career guidance. Would you like to book a session?",
    replyMr: "विद्यार्थी समुपदेशन केंद्र शैक्षणिक आणि करिअर मार्गदर्शन पुरवते.",
    action: "OPEN_COUNSELING"
  }
];

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      const userQuery = data.text.toLowerCase();
      const lang = data.language || 'en';

      let matchedIntent = knowledgeBase.find(item => 
        item.keywords.some(keyword => userQuery.includes(keyword))
      );

      let responsePayload = {};

      if (matchedIntent) {
        responsePayload = {
          text: lang === 'mr' ? matchedIntent.replyMr : matchedIntent.replyEn,
          action: matchedIntent.action
        };
      } else {
        responsePayload = {
          text: lang === 'mr' 
            ? "माफ करा, मला प्रश्न समजला नाही. कृपया परिसर मार्ग किंवा विभागांबद्दल विचारा."
            : "I'm sorry, I didn't recognize that query. Please ask about campus routes or departments.",
          action: "NONE"
        };
      }

      setTimeout(() => {
        ws.send(JSON.stringify(responsePayload));
      }, 400);

    } catch (err) {
      console.error("Invalid packet:", err);
    }
  });
});
