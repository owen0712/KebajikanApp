const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = mongoose.model("User");
const jwt=require("jsonwebtoken");
const {JWT_SECRET_ACCESS,JWT_SECRET_REFRESH,DOMAIN}=require('../config/keys');
const checkToken = require('../middlewares/checkToken');
const {sendMail} = require('../utils/nodemailer');
const {getAvatarImage} = require('../utils/imagereader');
const requiredLogin = require('../middlewares/requiredLogin');

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
            .then(async (user) => {
              const subject = 'Kebajikan App Registration Verfication';
              const content = `<p>Please click the link below to activate your account</p> <a href='${DOMAIN}/activate/${user._id}'>Click here</a>`
              await sendMail({destinationEmail:email,subject,content})
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
      if(savedUser.status=="Inactive"){
        return res.json({ error: "Your account is inactivated" });
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
            res.json({ user:{id:savedUser._id,name:savedUser.name,role:savedUser.role,charity_event_organizer:savedUser.charity_event_organizer,part_time_job_organizer:savedUser.part_time_job_organizer,charity_event_recipient:savedUser.charity_event_recipient,part_time_job_recipient:savedUser.part_time_job_recipient,access_token,refresh_token}, message: "Successfully signed in" });
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

// @route   POST /forgot_password
// @desc    Forgot Password
// @access  Private
router.post('/forgot_password',(req,res)=>{
  const {email}=req.body;
  if(!email){
      return res.json({error:'Please make sure all fields are filled'});
  }
  User.findOne({email:email}).then(savedUser=>{
      if(!savedUser){
          return res.json({error:'User is not existed'});
      }
      const access_token= jwt.sign({_id:savedUser._id},JWT_SECRET_ACCESS,{expiresIn:'10m'});
      const subject = 'Kebajikan App User Reset Password';
      const content = `<p>Please click the link below to reset your password</p> <a href='${DOMAIN}/reset_password/${access_token}'>Click here</a>`;
      const result = sendMail({destinationEmail:email,subject,content})
      if(!result){
          return res.json({error:"Error occurred!Please try again!"});
      }
      return res.json({message:"Reset password email successfully sent!"});
  }).catch(err=>{
      res.json({error:err});
  })
})

// @route   POST /reset_password
// @desc    Reset Password
// @access  Private
router.post('/reset_password',requiredLogin,(req,res)=>{
  const {password,confirm_password}=req.body;
  if(!password||!confirm_password){
      return res.json({error:'Please make sure all fields are filled'});
  }
  bcrypt.genSalt(10).then(salt=>{
    bcrypt.hash(password, salt).then((hashedpassword) => {
      User.findByIdAndUpdate(req.user._id,{password:hashedpassword},{new:false},(err,result)=>{
        if(err){
            return res.json({error:err})
        }
        return res.json({message:"Password reset successfully!"});
      })
    });
  });
})

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
    res.json({ user:{id:user._id,name:user.name,role:user.role,charity_event_organizer:user.charity_event_organizer,part_time_job_organizer:user.part_time_job_organizer,charity_event_recipient:user.charity_event_recipient,part_time_job_recipient:user.part_time_job_recipient,access_token,refresh_token} });
  })
});

// @route   POST /user/create
// @desc    Admin Create New User
// @access  Private
router.post("/user/create",requiredLogin, (req, res) => {
  const {name, email, password, role} = req.body;
  if (!name || !email || !password || !role ) {
      return res.json({ error: "Please fill all required fields" });
  }

  User.findOne({ email: email })
  .then((savedUser) => {
    if (savedUser) {
      return res.json({ error: "User already exist" });
    }
    const isOrganizer = (role==="Organizer"||role==="Admin");
    const avatar = getAvatarImage();
    bcrypt.genSalt(10).then(salt=>{
      bcrypt.hash(password, salt).then((hashedpassword) => {
        const user = new User({
          name,
          email,
          birthdate:Date.now(),
          phone_number:"-",
          profile_pic:avatar,
          password: hashedpassword,
          role,
          charity_event_organizer:isOrganizer,
          part_time_job_organizer:isOrganizer
        });

        user.save()
          .then(async (user) => {
            const subject = 'Kebajikan App Account Verfication';
            const content = `<p>Please click the link below to complete your info and activate your account</p> <a href='${DOMAIN}/activate/incomplete_info/${user._id}'>Click here</a>`
            await sendMail({destinationEmail:email,subject,content})
            res.json({ message: "New user successfully saved" });
          })
          .catch((err) => {
            console.log(err);
            res.json({ error: err });
          });
      });
    });
    
  })
  .catch((err) => {
    console.log(err);
    res.json({ error: err });
  });
});


module.exports = router;
