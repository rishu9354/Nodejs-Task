const express = require("express");

const authRoutes = require("./routes/auth")
const app = express();
const db = require("./config/mongodbConfig")
app.use(express.json());


app.use("/auth",authRoutes)

app.get("/",(req,res)=>{
    res.send("all things working!")
})
app.listen(5000, () => console.log("Server running on port 5000"));