import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// require('dotenv').config();

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) =>  {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:8000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    const result = await response.json();
    if(response.ok){
      alert('Signup succssful!')
      navigate('/login');
   }
   else {
      alert(result.message || 'Something went wrong');
    }
  } catch (error) {
    console.error(error);
    alert('Signup Failed: ', error);
  }
};

  return (
    <div className="min-h-screen bg-cover bg-center bg-[radial-gradient(ellipse_at_top_center,_rgba(0,0,0,0.8),_black)] text-black mx-2 my-2 rounded-xl px-10 py-10 justify-center items-center h-screen m-0 flex">
      <form onSubmit={handleSubmit} className="bg-white/20 p-8 rounded-lg shadow-lg max-w-md w-full mt-20 space-y-4">
        <h2 className="text-2xl font-bold text-center text-white">Sign Up</h2>

        <input
          required 
          type="text"
          name="name"
          placeholder="Username"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

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
          Sign Up
        </button>

        <p className="text-sm text-center text-black">
          Already have an account? <a href="/login" className="text-purple-600 hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}