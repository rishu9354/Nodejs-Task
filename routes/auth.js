const express = require("express");
const router = express.Router();
const {signUp, logIn,forget,resetPassword} = require("../controller/authController")

router.get("/",(req,res)=>{
    res.send("auth route working..")
})

router.post("/login",logIn);
router.post("/signup",signUp)
router.post("/forget-password",forget)
router.post("/reset",resetPassword)

module.exports = router;