const mongoose=require('mongoose');
const bcrypt = require('bcrypt');

const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    userGold:{
        type:Number,
        default:0
    },
    userWallet:{
        type:Number,
        default:0
    },

    // accesToken:{
    //     type:String,
    //     required:true
    // },
    // refreshToken:{
    //     type:String,
    //     required:true
    // }

})
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10); // hash with salt rounds = 10
  next();
});

userSchema.methods.isPasswordCorrect = async function(password) {
    console.log(password);
    console.log(this.password);
        
    return bcrypt.compare(password, this.password);
  };

const USER=mongoose.model("USER",userSchema);
module.exports=USER;
