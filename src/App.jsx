import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../src/components/Login';
import Chat from '../src/components/Chat';

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/chat" element={<Chat currentUser={user} />} />
      </Routes>
    </Router>
  );
};

export default App;
