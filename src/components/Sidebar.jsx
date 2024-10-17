import React from 'react';

const Sidebar = ({ users, selectUser }) => {
  return (
    <div className="sidebar">
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id} onClick={() => selectUser(user)}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
