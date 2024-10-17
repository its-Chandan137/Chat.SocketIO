import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MessageWindow from './MessageWindow';
import './Chat.css'

const Chat = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [recipient, setRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
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
    }
  }, [currentUser, navigate]);

  const selectUser = (user) => {
    setRecipient(user);
    fetchMessages(user._id);
  };

  const fetchMessages = async (recipientId) => {
    setLoadingMessages(true);
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${recipientId}`);
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async (text) => {
    const response = await fetch('http://localhost:5000/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: currentUser._id,
        recipient: recipient._id,
        text,
      }),
    });

    const newMessage = await response.json();
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="chat-container" style={{ display: 'flex', height: '100vh' }}>
      {loadingUsers ? (
        <p>Loading users...</p>
      ) : (
        <Sidebar users={users} selectUser={selectUser} />
      )}
      <div style={{ flex: 1 }}>
        {loadingMessages ? (
          <p>Loading messages...</p>
        ) : (
          <MessageWindow
            messages={messages}
            currentUser={currentUser}
            recipient={recipient}
            sendMessage={sendMessage}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
