import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isChatActive, setIsChatActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatboxRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Show welcome message on first render
  useEffect(() => {
    const welcomeMessage = {
      id: '1',
      sender: 'bot',
      text: "👋 Welcome to TechBuddy!\n\nI can help you with:\n• AI and Machine Learning\n• Scratch Programming\n• Web Development\n• Robotics\n• EA Sports\n• MIT App Inventor\n\nTo quit, type 'quit', 'exit', or 'bye'.",
      timestamp: new Date(),
      status: 'sent'
    };
    setMessages([welcomeMessage]);
  }, []);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleSend = async () => {
    if (!isChatActive || !input.trim() || isLoading) return;

    const userInput = input.trim();
    const userMessage = {
      id: generateId(),
      sender: 'user',
      text: userInput,
      timestamp: new Date(),
      status: 'sent'
    };

    setInput('');
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

        const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userInput })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const botReply = await response.text();
      setIsTyping(false);

      const botMessage = {
        id: generateId(),
        sender: 'bot',
        text: botReply === 'quit' ? '👋 Goodbye! Thanks for chatting with TechBuddy.' : botReply,
        timestamp: new Date(),
        status: 'sent'
      };

      setMessages(prev => [...prev, botMessage]);

      if (botReply === 'quit') {
        setIsChatActive(false);
      }
    } catch (error) {
      setIsTyping(false);
      const errorMessage = {
        id: generateId(),
        sender: 'bot',
        text: 'Sorry, I\'m having trouble connecting right now. Please try again.',
        timestamp: new Date(),
        status: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const restartChat = () => {
    setMessages([{
      id: generateId(),
      sender: 'bot',
      text: '👋 Welcome back to TechBuddy! How can I help you today?',
      timestamp: new Date(),
      status: 'sent'
    }]);
    setIsChatActive(true);
    setInput('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageText = (text) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="App">
      <div className="chat-header">
        <div className="header-info">
          <div className="bot-avatar">🤖</div>
          <div className="header-text">
            <h2>TechBuddy</h2>
            <span className="status">{isChatActive ? 'Online' : 'Chat ended'}</span>
          </div>
        </div>
        {!isChatActive && (
          <button onClick={restartChat} className="restart-btn">
            🔄 Restart
          </button>
        )}
      </div>

      <div className="chatbox" ref={chatboxRef}>
        {messages.map((message) => (
          <div key={message.id} className={`message-container ${message.sender}`}>
            <div className="message-avatar">
              {message.sender === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              <div className={`message ${message.sender}`}>
                {formatMessageText(message.text)}
              </div>
              <div className="message-info">
                <span className="timestamp">{formatTime(message.timestamp)}</span>
                {message.status === 'error' && <span className="error-badge">Error</span>}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message-container bot">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="message bot typing-indicator">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isChatActive ? (
        <div className="input-area">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            className="send-btn"
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
      ) : (
        <div className="chat-ended">
          <p>The chat has ended. Click restart to begin a new conversation.</p>
          <button onClick={restartChat} className="restart-full-btn">
            🔄 Start New Chat
          </button>
        </div>
      )}
    </div>
  );
}

export default App;