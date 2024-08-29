import React from 'react'
import "./Text.css"

const Text = ({ index }) => {
    const val = index;
    const container = [
        {
            title:"2019 NEW COLLECTION",
            heading:"Summer Collection",
            description:"Fashion should be a form of escapism and not a form of imprisonment",
            btn:"Shop Collection"
        },
        {
            title:"2019 NEW COLLECTION",
            heading:"Winter Sweatshirt",
            description:"Fashion should be a form of escapism and not a form of imprisonment",
            btn:"Shop Collection"
        },
        {
            title:"2019 NEW COLLECTION",
            heading:"Designer Swimwear",
            description:"Fashion should be a form of escapism and not a form of imprisonment",
            btn:"Shop Collection"
        }
    ]
  return (
    <div className='text'>
      <div>
      <p className='imageTitle  font-sans'>{container[val].title}</p>
      <h1 className='head text-6xl mb-4 font-black font-sans'>{container[val].heading}</h1>
      <p className='describe font-sans'>{container[val].description}</p>
      </div>
      <button className='showCollection'>Show Collection</button>
    </div>
  )
}

export default Text
