const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = mongoose.model("User");
const jwt=require("jsonwebtoken")
const {JWT_SECRET_ACCESS,JWT_SECRET_REFRESH,DOMAIN}=require('../config/keys');
const checkToken = require('../middlewares/checkToken');
const sendMail = require('../utils/nodemailer');
const getAvatarImage = require('../utils/imagereader');

// @route   POST /signup
// @desc    Sign Up
// @access  Public
router.post("/signup", (req, res) => {
  const {
    name,
    email,
    birthdate,
    phone_number,
    identity_no,
    profile_pic,
    password,
    role,
  } = req.body;
  if (!name || !email || !birthdate || !phone_number || !password) {
    return res.json({ error: "Please fill all required fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.json({ error: "User already exist" });
      }
      const avatar = profile_pic?profile_pic:getAvatarImage();
      bcrypt.genSalt(10).then(salt=>{
        bcrypt.hash(password, salt).then((hashedpassword) => {
          const user = new User({
            name,
            email,
            birthdate,
            phone_number,
            identity_no,
            profile_pic:avatar,
            password: hashedpassword,
            role,
          });
  
          user.save()
            .then((user) => {
              const subject = 'Kebajikan App Registration Verfication';
              const content = `<p>Please click the link below to activate your account</p> <a href='${DOMAIN}/activate/${user._id}'>Click here</a>`
              const result=sendMail({destinationEmail:email,subject,content})
              if(!result){
                return res.json({message:"Failed"});
              }
              res.json({ message: "New user successfully saved" });
            })
            .catch((err) => {
              res.json({ error: err });
            });
        });
      });
      
    })
    .catch((err) => {
      res.json({ error: err });
    });
});

// @route   POST /signin
// @desc    Sign In
// @access  Public
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ error: "Please fill email or password" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.json({ error: "Invalid email or password" });
      }
      if(savedUser.status=="Not Active"){
        return res.json({ error: "Please activate your account" });
      }
      bcrypt.compare(password, savedUser.password).then((isMatch) => {
        if (isMatch) {
          const _id = savedUser._id;
          const access_token= jwt.sign({_id},JWT_SECRET_ACCESS,{expiresIn:'10m'});
          const refresh_token= jwt.sign({_id},JWT_SECRET_REFRESH,{expiresIn:'1h'});
          if(savedUser.role=="User"){
            savedUser.role=0;
          }
          else if(savedUser.role=="Organizer"){
            savedUser.role=1;
          }
          else if(savedUser.role=="Admin"){
            savedUser.role=2;
          }
          User.findByIdAndUpdate(_id,{access_token,refresh_token},{new:false},(err,result)=>{
            if(err){
                console.log(err);
            }
            res.json({ user:{id:savedUser._id,name:savedUser.name,role:savedUser.role,access_token,refresh_token}, message: "Successfully signed in" });
          })
        } else {
          return res.json({ error: "Invalid email or password" });
        }
      });
    })
    .catch((err) => {
      res.json({ error: err });
    });
});

// @route   GET /refresh/user
// @desc    Get User Details If Refresh Token Valid
// @access  Private
router.get("/refresh/token", checkToken, (req, res) => {
  const user = req.user;
  if(user.role=="User"){
    user.role=0;
  }
  else if(user.role=="Organizer"){
    user.role=1;
  }
  else if(user.role=="Admin"){
    user.role=2;
  }
  const access_token= jwt.sign({_id:user._id},JWT_SECRET_ACCESS,{expiresIn:'10m'});
  const refresh_token= jwt.sign({_id:user._id},JWT_SECRET_REFRESH,{expiresIn:'1h'});
  User.findByIdAndUpdate(user._id,{access_token,refresh_token},{new:false},(err,result)=>{
    if(err){
        console.log(err);
    }
    res.json({ user:{id:user._id,name:user.name,role:user.role,access_token,refresh_token} });
  })
});

module.exports = router;
