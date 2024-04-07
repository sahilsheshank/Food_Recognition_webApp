import React, { useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import { useState } from 'react'
function Login() {
  const[form, setForm]=useState({
    name:'',
    email:'',
    password:''
  })
  const[error,setError]=useState({
    status:false,
    message:"please give a valid email"
  })
 
  const submitform=(e)=>{
    e.preventDefault();
    if(form.email.length<10){
      setError({...error,status:true});
      alert(error.message);
    }
    
  }
  
  const submitHandler=(event)=>{
      let val=event.target.value;
      let name=event.target.name;
      setForm((prev)=>({...prev,[name]:val}));
      
      
      
     
  }
  
 
  console.log(form);

  return(
    <Layout>
      <div className='w-full max-h-screen  flex flex-col justify-center items-center'>
      <form  className='flex flex-col justify-center w-2/5 items-center h-screen bg-violet-400 text-white rounded-xl' onSubmit={submitform}  >
       <h1>Log In to your account</h1>
          <input type="text" className='rounded-3xl border m-4 w- outline h-5 p-5 text-black' name='name' placeholder='Name' onChange={submitHandler}/>
          <input type='email' className='rounded-3xl border m-4 w- outline h-5 p-5 text-black' name='email' placeholder='Email' onChange={submitHandler} />
          <input type='password' className='rounded-3xl border m-4 w- outline h-5 p-5 text-black' name='password' placeholder='password' onChange={submitHandler} />
          <button className='bg-violet-800 hover:bg-blue-800 transition-all p-5 rounded-full w-1/4 ' type='submit'>Login</button>
          <div>name: {form.name}</div>
          <div>email: {form.email}</div>
          <div>password: {form.password}</div>
          {error.status && <div className="error">{error.message}</div>}
          
       </form>
      </div>
       
    </Layout>
  )
}

export default Login
