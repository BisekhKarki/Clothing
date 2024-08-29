import React, { useEffect, useState } from 'react'
import "./Register.css"
import { useNavigate,Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { clearData, registerUser } from '../../Reducers/RegistrationReducer/register';
import { toast, Bounce } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const Register = () => {

  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [userName,setUsername] = useState("")
  const dispatch  = useDispatch()
  const { data,error  } = useSelector((state)=>state.register)
  


    const handleRegister = (e)=>{
      e.preventDefault();
       try {
        const response =  dispatch(registerUser({
          username:userName,
          email,
          password
         }))
         
       } catch (error) {
       console.log(error)
       }
  
    }
    


  useEffect(()=>{
   
    if(data && data._id){
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
        setUsername("")
        setEmail("")
        setPassword("")
        dispatch(clearData({}))
    
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
   
  },[error,data])


  return (
    <>
    <div>
      <div className='RegisterNav px-12 py-2 text-xl'>
      <p>Sign Up</p>  
      <button className='homeButton text-base' onClick={()=>navigate('/')} >Home</button>
      </div>  
      <div className='mt-8'>
    <form className='registerForm'>
    <h1>Register To Login </h1>
      <div>
        <label>Username</label>
        <input placeholder='Username'  type='text'  value={userName} onChange={(e)=>setUsername(e.target.value)}  />
      </div>
      <div>
        <label>Email address<span>*</span> </label>
        <input placeholder='example@gmail.com' type='email'  value={email} onChange={(e)=>setEmail(e.target.value)}  />
      </div>
      <div>
        <label>Password<span>*</span> </label>
        <input placeholder='Password' type='password'  value={password} onChange={(e)=>setPassword(e.target.value)}  />
      </div>
      <Link  to={"/login"} className='toLogin'>Already have an account? Login</Link>
      <div className='registerUnderLine'></div>
      <button  onClick={(e)=>handleRegister(e)} className='registerButton'>Register</button>
    </form>
      </div>
    </div>
    </>
  )
}

export default Register
