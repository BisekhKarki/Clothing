import React from 'react'
import accessories from "../../../assets/Banner/graphic-banner-1.jpg.webp"
import mens from "../../../assets/Banner/graphic-banner-2-450x450.jpg.webp"
import hurry from "../../../assets/Banner/graphic-banner-3-450x450.jpg.webp"
import wow from "../../../assets/Banner/graphic-banner-4.jpg.webp"
import "./Second.css"

const Second = () => {
  return (
    <div className='second flex flex-row px-8 gap-5 mb-5'>
     <div className='flex flex-col gap-3'>
       <div>
       <img src={accessories} width={"720px"} height={"360px"} />
        <div className='accessories'>
            <p>Accessories <br></br>Collection</p>
            <span>SHOP NOW</span>
        </div>
       </div>
        <div className='subSecond flex gap-5'>
        <div>
        <img src={mens} width={"350px"} height={"350px"} />
        <div className='men'>
            <p>Mens <br></br> Collection</p>
            <span>SHOP NOW</span>
        </div>
        </div>
        <img src={hurry} width={"350px"} height={"350px"} />
        </div>
     </div>
     <div className='mt-2'>
     <img src={wow}  width={"700px"} height={"720px"}/>
     <div className='women'>
            <p>Womens <br></br> Collection</p>
            <span>SHOP NOW</span>
        </div>
     </div>
    </div>
  )
}

export default Second
