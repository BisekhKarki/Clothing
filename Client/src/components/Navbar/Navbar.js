import React, { useEffect, useState } from 'react'
import logo from "../../assets/images/logo.webp"
import { icons, navigation } from '../../NavLinks'
import { useNavigate } from 'react-router-dom'
import "./Navbar.css"


const Navbar = () => {

    const [showLogin,setShowLogin] = useState(false)
    localStorage.setItem('Token',"")
    const token = localStorage.getItem("Token")
    const navigate = useNavigate()
    useEffect(()=>{
        if(token.length > 0){
            setShowLogin(true);
    
        }else{
            setShowLogin(false)
        }
    },[])


  return (
   <div className='sticky' >
    <div className='navbar flex flex-row  items-center gap-x-4 justify-between px-7 py-7'>
        <img src={logo} className='h-6 w-18'  />
        <div className='navigation'>
            <ul className='flex flex-row gap-8'>
                {
                navigation.map((item,key)=>{
                    return(
                        <li className='nav'>
                            {item.nav}
                        </li>
                    )
                })}
            </ul>
        </div>
        <div className='icons'>
            {showLogin ? <ul className='flex flex-row gap-3'>
                {
                icons.map((item,key)=>{
                    return(
                        <li>
                            {item.iconName}
                        </li>
                    )
                })}
            </ul> : <button onClick={()=>navigate('/login')}>Signup</button>}
        </div>
    </div>
    <div className='navUnderline'>

    </div>
   </div>
  )
}

export default Navbar
