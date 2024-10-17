import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5001'); // Connect to the backend server

const Chat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [recipient, setRecipient] = useState('');

  useEffect(() => {
    // Fetch message history for the current user
    const fetchMessages = async () => {
      const response = await fetch(`http://localhost:5001/messages/${user.name}`);
      const data = await response.json();
      setMessages(data);
    };

    fetchMessages();

    // Listen for incoming messages
    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  }, [user]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (recipient && messageContent) {
      socket.emit('sendMessage', {
        sender: user.name,
        recipient,
        content: messageContent,
      });
      setMessageContent('');
    }
  };

  return (
    <div className="chat">
      <h1>Welcome, {user.name}</h1>
      <div>
        <label>Recipient: </label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </div>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}: </strong>
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type a message"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
