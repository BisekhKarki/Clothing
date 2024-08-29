const mongoosee =  require('mongoose')

const connection = async (url)=>{
    try {
        const connect = await mongoosee.connect(url,{
            useNewUrlParser:true,
            useUnifiedTopology: true
        })
        console.log("Database connected: ",connect.connection.host)
    } catch (error) {
        console.log(error)
    }



}
module.exports = connection