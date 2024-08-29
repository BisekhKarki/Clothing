import React, { useEffect, useState } from 'react'
import "./Login.css"
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { clearLogin, loginUser } from '../../Reducers/RegistrationReducer/register';
import { toast, Bounce } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
  
  const navigate = useNavigate();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading, error, login } = useSelector((state)=>state.register)
  
  const handleSubmit = (e)=>{
      e.preventDefault();
      dispatch(loginUser({email,password}))

      setEmail("")
      setPassword("")
  }

  useEffect(()=>{
    if(login && login.email){
      toast.success('User registered successfully!', {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });  
        dispatch(clearLogin({}))

    }

    if(error && error.message.length > 0){
      toast.warning(error.message, {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,  
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });
     }
    },[login,error])


  return (
    <>
    <div className='login'>
      
      <div className='loginNav px-12 py-2 text-xl'>
      <p>Login</p>  
      <button className='homeButton text-base' onClick={()=>navigate('/')} >Home</button>
      </div>  
      <div className='mt-8'>
       
    <form className='loginForm'>
      <h1>Login</h1>
      <div>
        <p>Email address <span>*</span> </p>
        <input placeholder='abc@example.com' type='email' value={email} onChange={(e)=>setEmail(e.target.value)}  />
      </div>
      <div>
        <p>Password<span>*</span> </p>
        <input placeholder='password' type='password' value={password} onChange={(e)=>setPassword(e.target.value)}  />
      </div>
      <Link  to={"/register"} className='toRegister'>Don't Have and account? Register</Link>
      <div className='loginUnderLine'></div>
      <button onClick={(e)=>handleSubmit(e)} className='loginButton'>Login</button>
    </form>
      </div>
    </div>
    </>
  )
}

export default Login
