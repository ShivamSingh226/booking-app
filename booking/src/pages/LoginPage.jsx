import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';
const LoginPage = () => {
  const[password,setPassword]=useState('');
  const[email,setEmail]=useState('');
  async function handleLoginSubmit(e){
    e.preventDefault();
    try{
        await axios.post('/login',{email,password});
        alert('Login was successful');
    }catch(e){
        alert('Login failed!');
    }
  }
  return (
    <div  className="mt-4 grow flex items-center justify-around">
        < div className='mb-64'>
        <h1 className='text-4xl text-center mb-4'>Login Form</h1>
        <form className="max-w-md mx-auto " onSubmit={handleLoginSubmit}>
            <input type='email' placeholder='youremail@email.com' value={email} onChange={e=>setEmail(e.target.value)}/>
            <input type='password' placeholder='password' value={password} onChange={e=>setPassword(e.target.value)}/>
            <button className='primary'>Login</button>
            <div className='text-center py-2 text-gray-500'>
                Don't have an account yet? <Link className='underline text-black' to={"/register"}>Register Now</Link>
            </div>
        </form>
        </div>
    </div>
  )
}

export default LoginPage