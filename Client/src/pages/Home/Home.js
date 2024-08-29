import React from 'react'
import "./Home.css"
import ImageSlide from './ImageSlider/ImageSlide'
import Second from './Second/Second'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

const Home = () => {

  return (
   <>
    <div>
    <Navbar />
    <ImageSlide />
    <Second />
    <Footer />
    </div>
   </>
  )
}

export default Home
