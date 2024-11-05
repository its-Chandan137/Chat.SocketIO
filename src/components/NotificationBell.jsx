import React from 'react';

const NotificationBell = ({ unreadCount, onClick }) => {
  return (
    <div style={{ position: 'relative', cursor: 'pointer' }} onClick={onClick}>
      <i className="fa fa-bell" style={{ fontSize: '24px' }} /> {/* FontAwesome bell icon */}
      {unreadCount > 0 && (
        <span style={{
          position: 'absolute', top: '-5px', right: '-10px',
          background: 'red', color: 'white', borderRadius: '50%',
          padding: '2px 6px', fontSize: '12px'
        }}>
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
