require('dotenv').config()
const express = require('express')
const app = express();
const PORT = process.env.PORT || 8000 ;
// const router = express.Router()
const cors = require('cors')


// Middleware
app.use(express.json())
app.use(cors());





// Connection to the database 
const connect = require('./db/Connect')
connect(process.env.MONGO_URL)

app.use('/',require('./router/UserRegistration'))
app.use(require('./Middleware/Middleware'))

app.listen(PORT,()=>{
    console.log(`Server Running at PORT: ${PORT}`)
})