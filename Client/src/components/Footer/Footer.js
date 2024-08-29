import React from 'react'
import "./Footer.css"
import { IoMdArrowForward } from "react-icons/io";
import { FaFacebookF } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { FaLinkedinIn } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaPinterestP } from "react-icons/fa";
import logo from "../../assets/images/footer-logo.webp"
import { Categories, Company, Customer } from './foot';
import first from "../../assets/footerImage/first.webp"
import second from "../../assets/footerImage/second.webp"
import third from "../../assets/footerImage/third.webp"
import fourth from "../../assets/footerImage/fourth.webp"
import fifth  from"../../assets/footerImage/fifth.webp"
import sixth from "../../assets/footerImage/sixth.webp"
import seventh from "../../assets/footerImage/seventh.webp"
import eight from "../../assets/footerImage/eight.webp"
import card from "../../assets/Cards/master.webp"


const Footer = () => {

    let firstFour = [first,second,third,fourth]
    let lastFour = [fifth,sixth,seventh,eight]
    

  return (
    <>
    <div className='footer text-white text-center py-4'>
        <div className='footertop flex flex-row  gap-72 items-center justify-center '>
            <div className='mt-4'>
            <span className='text-xs'>LAST CHANCE TO WIN OUR DISCOUNT!</span>
            <input className='footerInput ml-4'  placeholder='Enter your mail...' />
            <div className='suscribe' >
                <span className='flex flex-row gap-1'>SUSCRIBE<button><IoMdArrowForward   /></button> </span>
            </div>
            </div>
            <div className='footerSocials flex gap-6 items-center' >
                <span>ON SOCIAL NETWORKS</span>
                <div className='flex items-center gap-2'>
                    <FaFacebookF />
                    <BsTwitterX />
                    <FaLinkedinIn />
                    <FaInstagram />
                    <FaPinterestP />
                </div>

            </div>
        </div>
        <div className='footerUnderline w-full'></div>
        <div className='footerMid ml-4 flex flex-row justify-center py-10 px-12 gap-14 text-left text-sm'>
            <div className='midFirst flex flex-col gap-1 mt-4'>
                <img src={logo} className='h-5 w-20'  />
                 <p className='w-64 text-left'> 
                    Lorem Ipsum is simply dummy text of the printing and 
                    typesetting industry lorem Ipsum is simply dummy text 
                    of industry lorem ipsum is simply dummy typesetting text.  </p>   
            </div>
            <div className='midSecond'>
                <h1 className='footerHeader font-bold mb-2 text-base'>Categories</h1>
                <ul  className='flex flex-col gap-1'>
                    {
                        Categories.map((c,k)=>{
                            return(
                                <li className='cursor-pointer' key={k}>
                                    {c.name}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className='midThird'>
            <h1 className='footerHeader font-bold mb-2 text-base' >Customer</h1>
                <ul className='flex flex-col gap-1'>
                    {
                        Customer.map((c,k)=>{
                            return(
                                <li className='cursor-pointer' key={k}>
                                    {c.name}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className='midFourth'>
            <h1 className='footerHeader font-bold mb-2 text-base' >Company</h1>
                <ul className='flex flex-col gap-1 ' >
                    {
                        Company.map((c,k)=>{
                            return(
                                <li key={k} className='cursor-pointer'>
                                    {c.name}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className='footerLast flex flex-col'>
                <h1 className='footerHeader font-bold mb-2 text-base'>Follow us on Instagram</h1>
                <div className='flex gap-2'>
                {
                firstFour.map((i,k)=>{
                    return(
                        <img  src={i}  className='cursor-pointer h-14 w-14' />
                    )
                })
            }
                </div>
            
            <div className='flex gap-2 mt-3'  >
            {
                lastFour.map((i,k)=>{
                    return(
                        <img src={i}  className='cursor-pointer h-14 w-14' />
                    )
                })
            }
            </div>
        </div>
       
        </div>
    </div>
    <div className='footerBottom flex items-center justify-center py-5'>
            <span>© 2024 HONGO is Proudly Powered by ThemeZaa</span>
            <img src={card} />
            
        </div>
    </>
  )
}

export default Footer
