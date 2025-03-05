const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("Database Connected Successfully")
    } catch (error) {
        console.log(error)
    }
}


module.exports = { 
    connectDB
}