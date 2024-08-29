const mongoose = require('mongoose')

const register = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please provide username"]
    },
    email:{
        type:String,
        required:[true,"Please provide email"]
    },
    password:{
        type:String,
        required:[true,"Please provide password"]
    }

})


const User = new mongoose.model('User',register)

module.exports = User