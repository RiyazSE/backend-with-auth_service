const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcryptjs = require('bcryptjs');


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

//secure password

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = bcryptjs.hashSync(this.password,10)
    }
    next();
})

//gernrate token to verify user

userSchema.methods.generateToken = async function(){
    try{
     let generateToken = jwt.sign({_id:this._id},process.env.SECRET_KEY);
     this.tokens = this.tokens.concat({token:generateToken})
     await this.save();
     return generateToken;
    } catch (error){
      console.log(err);
    }
}
//model
const users = new mongoose.model("USER",userSchema);
module.exports = users;