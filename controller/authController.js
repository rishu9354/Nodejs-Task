const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken} = require("../utils/generateToken")



module.exports.signUp = async (req,res)=>{

    try {
     let {username,email,password}= req.body;
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt, async(err,hash)=>{
            let createUser = await userModel.create({
                username,
                email,
                password:hash
            })
            let token = generateToken(createUser);
            res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
            res.json({
                success:true,
                createUser,
                token,
                msg:'User data save'
            })
            // res.send(createUser)
        })
    })
    } catch (error) {
         res.send(err.message);
    }
}

module.exports.logIn = async (req,res)=>{
     try{
        let user = await userModel.findOne({email:req.body.email});
        if(!user) return res.json({success:false,msg:"User not register!"});
        // check password
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.json({ success: false, msg: "Invalid password!" });

        let token = generateToken(user);
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });

        res.json({
            success: true,
            user,
            token,
            msg: "Login successful!"
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, msg: "Server error" });
    }
}

module.exports.forget = async (req,res)=>{
    try {
        
        const {email} = req.body;
        const user = await userModel.findOne({email});
        if(!user) return res.status(400).json({success:false,msg:"User not Found!"});
    
    
        // secret token with expries time
        const resetToken = jwt.sign({id:user._id}, "resetSecret",{expiresIn:"15m"})
        res.json({success:true,msg:"Password reset link generated", resetToken})
    } catch (error) {
         res.status(500).json({ success: false, msg: "Server error" });
    }

}

module.exports.resetPassword = async (req,res)=>{
    try {
        const {token, newPassword} = req.body;
        if(!token || !newPassword){
            return res.status(400).json({success:false,msg:"Missing Data!"})
        }

        // verify token 
        const decoded = jwt.verify(token,"resetSecret");
        const user= await userModel.findById(decoded.id);
        if(!user){
            return res.status(400).json({ success: false, msg: "User not found" });
        }

        // hash new password
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword,salt);

        user.password = hashed;
        await user.save();
        res.json({ success: true, msg: "Password updated successfully!" });
        
    } catch (error) {
        console.error("Reset error:", error);
        res.status(400).json({ success: false, msg: "Invalid or expired token" });
    }
}