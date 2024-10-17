import React, { useState } from 'react';
import Login from './components/Login.jsx';
import Chat from './components/Chat.jsx';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="app">
      {!user ? (
        <Login setUser={setUser} />
      ) : (
        <Chat user={user} />
      )}
    </div>
  );
}

export default App;
