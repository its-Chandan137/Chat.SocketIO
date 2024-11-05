import React, { useEffect, useRef, useState } from 'react';

const MessageWindow = ({ messages, currentUser, recipient, sendMessage }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null); // Ref to the bottom of the messages container
  const messagesContainerRef = useRef(null); // Optional: Ref to the entire messages container

  // Auto-scroll to the bottom whenever new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle form submission for sending messages
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) { // Ensure non-empty messages
      sendMessage(message);
      setMessage(''); // Clear input after sending
    }
  };

  // console.log(currentUser, "---------VS----------", messages )

  return (
    <div className="chat-window">
      <h3>Chat with {recipient ? recipient.name : 'Select a user'}</h3>
      <div className="messages" ref={messagesContainerRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.senderId === currentUser._id ? 'message sent' : 'message received'}
          >
            <p>{msg.text}</p>
          </div>
        ))}
        {/* This div ensures the auto-scroll happens correctly */}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default MessageWindow;
