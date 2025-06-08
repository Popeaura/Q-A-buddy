import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message) return;
    try {
      const response = await axios.post('/chat', { message });
      setChat([...chat, { text: message, isUser: true }, { text: response.data.response, isUser: false }]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Chat with TechBuddy</h2>
      <div style={{ height: '300px', border: '1px solid #ccc', overflowY: 'scroll', marginBottom: '10px', padding: '10px' }}>
        {chat.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.isUser ? 'right' : 'left', color: msg.isUser ? 'blue' : 'green', margin: '5px 0' }}>
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        style={{ width: '70%', padding: '10px', marginRight: '10px' }}
      />
      <button onClick={sendMessage} style={{ padding: '10px' }}>Send</button>
    </div>
  );
}

export default App;
