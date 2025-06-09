import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// require('dotenv').config();

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('https://adhar-verification.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username',data.user.name)
      alert('Login successful!');
      navigate('/'); // or any route you want
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (error) {
    alert(`Login Failed: ${error.message}`);
  }
};


  return (
    <div className="min-h-screen bg-cover bg-center bg-[radial-gradient(ellipse_at_top_center,_rgba(0,0,0,0.8),_black)] text-black mx-2 my-2 rounded-xl px-10 py-10 justify-center items-center h-screen m-0 flex">
      <form onSubmit={handleSubmit} className="bg-white/20 p-8 rounded-lg shadow-lg max-w-md w-full mt-20 space-y-4">
        <h2 className="text-2xl font-bold text-center text-white">Login</h2>

        <input
          required 
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          required 
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200"
        >
          Login
        </button>

        <p className="text-sm text-center text-black">
          Don’t have an account? <a href="/signup" className="text-purple-600 hover:underline">Sign up</a>
        </p>
      </form>
    </div>
  );
}