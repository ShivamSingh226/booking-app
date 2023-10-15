import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
const LoginPage = () => {
  const[password,setPassword]=useState('');
  const[email,setEmail]=useState('');
  const[redirect,setRedirect]=useState(false);
  const{setUser}=useContext(UserContext);
  async function handleLoginSubmit(e){
    e.preventDefault();
    try{
       const {data}= await axios.post('/login',{email,password});
       setUser(data);
        alert('Login was successful');
        setRedirect(true);
    }catch(e){
        alert('Login failed!');
    }
  }
  if(redirect){
    return <Navigate to={'/'}/>
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