const express = require('express')
const app = express();
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerUser = async (req,res)=>{
        try {
            const {username,email,password } = req.body
            if(username === "" || email==="" || password==="" ){
                return res.status(400).json({ message: 'Please fill all the input fields' });
            }

            if(password.length < 6){
                return res.status(400).json({
                    message:"Password must be atleast 6 characters"
                })
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password,salt)
            const user = new User({
                    username,
                    email,
                    password:hashedPassword
    
                })
    
    
            const saveUser = await user.save();
           
            return res.status(201).json(saveUser)
        } catch (error) {
           return res.status(500).json({ message: "Server error. Please try again later." });
        }
}



const loginUser = async (req,res)=>{
    try {
        const {email,password} = req.body;
        if(email === '' || password === '' ){
            return res.status(400).json({ message:"Fill the details to login" })
        }

        const user = await User.findOne({ email:email })
        if(!user){
            return res.status(400).json({ message:"Invalid Credentials" })
        }

        const checkPassword = await bcrypt.compare(password,user.password)
        if(!checkPassword){
            return res.status(400).json({ message:"Invalid Password" })
        }

        const token = jwt.sign({ userId: user._id },"myNameIsHero",{
            expiresIn:'1d'
        })

        localStorage.setItem("Token",token)

        console.log(token)
        return res.status(200).json({ message:"User details correct" },user.email, user.password,token)



    } catch (error) {
        return res.status(500).json({ message:"Server error. Please try again later." })
    }
}


module.exports = {  registerUser, loginUser }