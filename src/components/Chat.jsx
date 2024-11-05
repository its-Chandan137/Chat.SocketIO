import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MessageWindow from './MessageWindow';
import './Chat.css';
import { io } from 'socket.io-client'; // Import Socket.IO client

const socket = io('http://localhost:5000'); // Initialize socket connection

const Chat = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [recipient, setRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const navigate = useNavigate();

  console.log(currentUser, "Current user")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        // console.log(data.users.filter(user => user._id !== currentUser._id), "RESPONSEds")
        setUsers(data.users.filter(user => user._id !== currentUser._id));
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };
    
    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');  // Redirect to login if no user is logged in
    } else {
      socket.emit('join', { userId: currentUser._id }); // Join the room on connection
    }

    // Listen for incoming messages
    socket.on('receiveMessage', (message) => {
      if (message.senderId === recipient?._id || message.senderId === currentUser._id) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [currentUser, navigate, recipient]);

  const selectUser = (user) => {
    setRecipient(user);
    
    // Fetch previous messages (this remains an API call as historical data retrieval)
    fetchMessages(user._id);
  };

  const fetchMessages = async (recipientId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${currentUser._id}/${recipientId}`);
      const messages = await response.json();
      setMessages(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = (text) => {
    const newMessage = { senderId: currentUser._id, receiverId: recipient._id, text };
    
    // Emit the message via Socket.IO
    socket.emit('sendMessage', newMessage);

    // Optimistically update the UI
    setMessages(prevMessages => [...prevMessages, { ...newMessage, timestamp: new Date() }]);
  };

  return (
    <div className="chat-container" style={{ display: 'flex', height: '100vh' }}>
      {loadingUsers ? (
        <p>Loading users...</p>
      ) : (
        <Sidebar users={users} selectUser={selectUser} />
      )}
      <div className="upperWindow" style={{ flex: 1 }}>
        <MessageWindow
          messages={messages}
          currentUser={currentUser}
          recipient={recipient}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
