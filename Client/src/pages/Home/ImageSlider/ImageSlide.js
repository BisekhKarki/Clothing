import React, { useEffect, useState } from 'react'
import slideOne from "../../../assets/Slider/home-page-fashion-slider-01.jpg"
import slideTwo from "../../../assets/Slider/home-page-fashion-slider-02.jpg"
import slideThree from "../../../assets/Slider/home-page-fashion-slider-03.jpg"
import Text from './Text'


const ImageSlide = () => {
    let [index,setIndex] = useState(0);
    const slidingImages = [slideOne,slideTwo,slideThree]

   useEffect(()=>{
    const interval = setInterval(() => {
        setIndex(prevIndex => (prevIndex >= 2 ? 0 : prevIndex + 1));
      }, 3000);
  
      return () => clearInterval(interval);
   },[])
   


  return (
   <>
    <div className='slide'>
      <img src={slidingImages[index]}  className='slider'/>
      <Text index={index} />
      
    </div>
    <div className='showIndex'>
    <div>
    <p>0{index}</p>
    <div className='indexUnderline'></div>
    </div>
    <div>
    <p>0{index+1}</p>
    <div className='indexUnderline'></div>
    </div>
    </div>
    </>
  )
}

export default ImageSlide