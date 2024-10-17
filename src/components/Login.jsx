import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook

const Login = ({ setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();  // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();
      if (data.user) {
        setUser(data.user);  // Set the logged-in user
        navigate('/chat');   // Redirect to chat page
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Server error, please try again later.');
    }
  };

  return (
    <div className="login">
      <h1>Login/Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br/>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;
