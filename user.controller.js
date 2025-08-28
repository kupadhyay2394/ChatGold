const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./user.models");


const userRouter = express.Router();


userRouter.post("/signup", async (req, res) => {
try{
    console.log('heloo login');
    
const { userName, fullName, email, password, userWallet } = req.body;
const exists = await User.findOne({ $or: [{ userName }, { email }] });
if(exists) return res.status(400).json({ message: "User already exists" });


const user = await User.create({ userName, fullName, email, password,userWallet });
const token = jwt.sign({ id: user._id, userName: user.userName }, process.env.JWT_SECRET, { expiresIn: "7d" });
res.status(201).json({ user, token });
}catch(err){
console.error(err);
res.status(500).json({ message: "Server error" });
}
});


userRouter.post("/login", async (req, res) => {
try{
 
    

const { userName, password } = req.body;
console.log(userName);

const user = await User.findOne({ userName });




if(!user) return res.status(401).json({ message: "Invalid credentials" });
const ok = await user.isPasswordCorrect(password);


if(!ok) return res.status(401).json({ message: "Invalid credentials" });


const token = jwt.sign({ id: user._id, userName: user.userName }, process.env.JWT_SECRET, { expiresIn: "7d" });
res.json({ user, token });
}catch(err){
console.error(err);
res.status(500).json({ message: "Server error" });
}
});


module.exports = userRouter;