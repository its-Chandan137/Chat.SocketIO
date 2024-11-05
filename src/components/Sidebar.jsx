import React, { useState } from 'react';
import './Sidebar.css'

const Sidebar = ({ users, selectUser }) => {
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleSelectUser = (user) => {
    setSelectedUserId(user._id);
    selectUser(user);
  };

  // Re-order the users list to place the selected user at the top
  const reorderedUsers = selectedUserId
    ? [users.find((user) => user._id === selectedUserId), ...users.filter((user) => user._id !== selectedUserId)]
    : users;

  return (
    <div className="sidebar">
      <h2>Users</h2>
      <ul>
        {reorderedUsers.map((user) => (
          <li
            key={user._id}
            onClick={() => handleSelectUser(user)}
            className={selectedUserId === user._id ? 'selected bg-green' : ''}
            style={{ cursor: 'pointer' }}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
