import React, { useState, useEffect } from 'react';
import './Sidebar.css';

const Sidebar = ({ users = [], selectUser, messages = [], currentUser }) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({}); // State to track unread message counts per user

  // useEffect to calculate unread messages count
  useEffect(() => {
    // Calculate unread message counts only if the dependencies truly change
    const counts = {};
  
    users.forEach((user) => {
      const userMessages = messages.filter(
        (msg) =>
          msg.senderId === user._id &&
          msg.receiverId === currentUser._id &&
          msg.read !== true
      );
      counts[user._id] = userMessages.length;
    });
  
    // Only update if the new counts are different from the current state
    if (JSON.stringify(counts) !== JSON.stringify(unreadMessages)) {
      setUnreadMessages(counts);
    }
  }, [messages, users, currentUser]);

  const handleSelectUser = (user) => {
    setSelectedUserId(user._id);
    selectUser(user);

    // Mark messages from this user as read
    setUnreadMessages((prevUnread) => ({
      ...prevUnread,
      [user._id]: 0,
    }));
  };

  // Re-order the users list to place the selected user at the top
  const reorderedUsers = selectedUserId
    ? [users.find((user) => user._id === selectedUserId), ...users.filter((user) => user._id !== selectedUserId)]
    : users;

  // Get the last message sent or received by each user
  const getLastMessage = (userId) => {
    const userMessages = messages.filter(
      (msg) => (msg.senderId === userId && msg.receiverId === currentUser._id) ||
               (msg.senderId === currentUser._id && msg.receiverId === userId)
    );
    if (userMessages.length === 0) return '';
    return userMessages[userMessages.length - 1].text; // Show the text of the last message
  };

  console.log(reorderedUsers, "reorderedUsers")
  console.log(messages, "messages")

  return (
    <div className="sidebar">
      <h2>Users</h2>
      <ul>
        {reorderedUsers.map((user) => (
          <li
            key={user._id}
            onClick={() => handleSelectUser(user)}
            className={selectedUserId === user._id ? 'selected bg-green' : ''}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            {user.name}
            
            {/* Show unread notification badge */}
            {unreadMessages[user._id] > 0 && (
              <span
                className="unread-dot"
                style={{
                  background: 'green',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  position: 'absolute',
                  right: '10px',
                  top: '10px',
                }}
              />
            )}

            {/* Show last message under the user name */}
            <p style={{ fontSize: '0.9em', color: '#666', marginTop: '4px' }}>
              {getLastMessage(user._id)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
