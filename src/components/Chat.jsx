import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MessageWindow from './MessageWindow';
import './Chat.css';
import { io } from 'socket.io-client';
import NotificationBell from './NotificationBell'; //// Added NotificationBell component for the bell icon

const socket = io('http://localhost:5000');

const Chat = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [recipient, setRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [allMessages, setAllMessages] = useState([]); //// New state to store all messages
  const [unreadCount, setUnreadCount] = useState(0); //// New state for unread message count
  const [showNotifications, setShowNotifications] = useState(false); //// New state to toggle notifications dropdown
  const [loadingUsers, setLoadingUsers] = useState(true);
  const navigate = useNavigate();

  console.log(currentUser, "Current user");
  console.log(allMessages, "allMessages");

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
    } else {
      socket.emit('join', { userId: currentUser._id });
    }

    // Listen for incoming messages
    socket.on('receiveMessage', (message) => {
      setAllMessages((prevMessages) => [...prevMessages, message]); //// Update allMessages with each new message

      if (message.senderId === recipient?._id || message.senderId === currentUser._id) {
        setMessages(prevMessages => [...prevMessages, message]);
      } else {
        setUnreadCount(prevCount => prevCount + 1); //// Increment unread count if message is not from the active chat
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [currentUser, navigate, recipient]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setUnreadCount(0); //// Reset unread count when notifications are viewed
  };

  const selectUser = (user) => {
    setRecipient(user);
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
    socket.emit('sendMessage', newMessage);
    setMessages(prevMessages => [...prevMessages, { ...newMessage, timestamp: new Date() }]);
  };

  console.log(users, "users CHAT")

  return (
    <div className="chat-container" style={{ display: 'flex', height: '100vh' }}>
      <nav style={{ position: 'relative', padding: '10px' }}> 
        <NotificationBell unreadCount={unreadCount} onClick={toggleNotifications} />
      </nav>
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

      {showNotifications && ( //// Notifications dropdown
        <div className="notifications-popup" style={{
          position: 'absolute', top: '50px', right: '20px', 
          width: '300px', maxHeight: '400px', overflowY: 'scroll', 
          background: 'white', border: '1px solid #ccc', padding: '10px', color: 'black'
        }}>
          <h4>All Messages</h4>
          {allMessages.map((msg, index) => (
            <div key={index} style={{
              padding: '8px', borderBottom: '1px solid #eee'
            }}>
              <strong>{msg.senderId === currentUser._id ? "You" : msg.senderId}</strong>: {msg.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chat;
