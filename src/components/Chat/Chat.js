import React, { useState, useEffect, useRef } from 'react';
import { ref, push, onValue } from 'firebase/database';
import './Chat.css';

function Chat({ gameId, playerId, playerName, database }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const chatRef = ref(database, `games/${gameId}/chat`);
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
        setMessages(messageList);
      }
    });

    return () => unsubscribe();
  }, [gameId, database]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const chatRef = ref(database, `games/${gameId}/chat`);
      const message = {
        text: newMessage,
        playerId,
        playerName,
        timestamp: Date.now()
      };

      try {
        await push(chatRef, message);
        setNewMessage('');
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.playerId === playerId ? 'my-message' : 'other-message'}`}
          >
            <div className="message-header">
              <span className="message-sender">{message.playerName}</span>
              <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>
            <div className="message-content">{message.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="chat-input"
        />
        <button type="submit" className="chat-send-button">
          Enviar
        </button>
      </form>
    </div>
  );
}

export default Chat;