import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isChatActive, setIsChatActive] = useState(true);

  // Show welcome message and instructions on first render
  useEffect(() => {
    setMessages([{
      sender: 'bot',
      text: "👋 Welcome to TechBuddy!\nI can answer questions about AI, Scratch, web development, robotics, EA Sports, and MIT App Inventor.\nTo quit, type 'quit', 'exit', or 'bye'."
    }]);
  }, []);

  const handleSend = async () => {
    if (!isChatActive || !input.trim()) return;

    const userInput = input;
    setInput('');

    // Add user message
    setMessages(msgs => [...msgs, { sender: 'user', text: userInput }]);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userInput })
      });
      const botReply = await response.text();

      // If bot says "quit", end the chat
      if (botReply === "quit") {
        setMessages(msgs => [...msgs, { sender: 'bot', text: "👋 Goodbye! Thanks for chatting with TechBuddy." }]);
        setIsChatActive(false);
      } else {
        setMessages(msgs => [...msgs, { sender: 'bot', text: botReply }]);
      }
    } catch (error) {
      setMessages(msgs => [...msgs, { sender: 'bot', text: "Sorry, something went wrong." }]);
    }
  };

  return (
    <div className="App">
      <div className="chatbox">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <strong>{msg.sender === 'user' ? 'You' : 'TechBuddy'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      {isChatActive ? (
        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      ) : (
        <div className="chat-ended">
          The chat has ended. Refresh the page to start again.
        </div>
      )}
    </div>
  );
}

export default App;
