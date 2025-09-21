const mongoose = require("mongoose");

require("dotenv").config();

const clientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: { version: '1', strict: true, deprecationErrors: true } 
}

mongoose.connect(process.env.MONGODB_URI, clientOptions)
.then(()=>console.log("MongoDB Atlas Connected.."))
.catch((err)=>console.error("MongoDB Atlas Error: ",err))


module.exports = mongoose.connection;