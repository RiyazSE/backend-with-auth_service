const express = require('express');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
//configure env file
dotenv.config({path:"./config.env"});
require('./database/connection')

//model
const users = require('./database/models/userSchema');
const Message = require('./database/models/messageSchema')
//this method is used to get data & cookies from frontend.
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
//Register
app.post('/register',async(req,res)=>{
    try{
       //get data
       const username = req.body.username;
       const email = req.body.email;
       const password = req.body.password;
       const createUser = new users({
        username:username,
        email:email,
        password:password
       }) 
       const created = await createUser.save();
       console.log(created,"created");
       res.status(200).send("Registered")
    } catch(err){
       res.status(400).send(error)
    }
})
//login
app.post('/login',async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
         //find if user exist
         const user = await users.findOne({email : email});
         if(user){
             //verify password
             const isMatch = await bcryptjs.compare(password, user.password);
             if(isMatch){
                  //generate token if user define in schema
                  const token = await user.generateToken();
                  res.cookie("jwt",token,{
                      //expires token in 24hrs
                      expires : new  Date(Date.now() + 86400000),
                      httpOnly : true
                  })
                  res.status(200).send("loggedIn")
             }else{
                res.status(400).send("invalid credentials")
             }
         }else{
            res.status(400).send("invalid credentials")
         }
    } catch (error) {
        res.status(400).send(error);
    }
})
//message
app.post('/message',async(req,res)=>{
    try{
       //get data
       const name = req.body.name;
       const email = req.body.email;
       const message = req.body.message;
       const sendMessage = new users({
        name:name,
        email:email,
        message:message
       }) 
       const created = await sendMessage.save();
       console.log(created,"sent");
       res.status(200).send("Registered")
    } catch(err){
       res.status(400).send(error)
    }
})
const PORT = process.env.port || 4001
app.listen(PORT,(req,res)=>{
    console.log(`server is running at port ${PORT}`);
})


//to update score create route  /user(gamer)
// app.put("/user",async function(req,res){
//     //destructure
//     let {username,score}=req.body;
//     //check user exist or not
//     const existUser=await db.collection("users").findOne({username:username});
//     if(isExisting){
//         // update object
//         await db.collection("users").updateOne({username},{$set:{username,score}});
//         res.send({status:true,msg:"user score updated successfully in dbase"});

//     }else{
//         res.send({status:false,msg:"username is not found1 try again with valid credentials"});

//     }
// })