import React, { useState } from 'react';

const MessageWindow = ({ messages, currentUser, recipient, sendMessage }) => {
    const [message, setMessage] = React.useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      sendMessage(message);
      setMessage('');
    };
  
    return (
      <div className="chat-window">
        <h3>Chat with {recipient ? recipient.name : 'Select a user'}</h3>
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={msg.sender === currentUser._id ? 'message sent' : 'message received'}>
              {msg.text && <p>{msg.text}</p>}
              {msg.fileUrl && (
                <div>
                  <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                    Download file
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="message-form">
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    );
  };
  
  export default MessageWindow;
  
