const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = mongoose.model("User");
const jwt=require("jsonwebtoken")
const {JWT_SECRET}=require('../config/keys');

// @route   POST /signup
// @desc    Sign Up
// @access  Public
router.post("/signup", (req, res) => {
  console.log(req.body);
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
      bcrypt.genSalt(10).then(salt=>{
        bcrypt.hash(password, salt).then((hashedpassword) => {
          const user = new User({
            name,
            email,
            birthdate,
            phone_number,
            identity_no,
            profile_pic,
            password: hashedpassword,
            role,
          });
  
          user.save()
            .then((user) => {
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
      bcrypt.compare(password, savedUser.password).then((isMatch) => {
        if (isMatch) {
          const _id = savedUser._id;
          const token= jwt.sign({_id},JWT_SECRET,{expiresIn:'360000'});
          if(savedUser.role=="User"){
            savedUser.role=0;
          }
          else if(savedUser.role=="Organizer"){
            savedUser.role=1;
          }
          else if(savedUser.role=="Admin"){
            savedUser.role=2;
          }
          res.json({ user:{id:savedUser._id,name:savedUser.name,role:savedUser.role,token}, message: "Successfully signed in" });
        } else {
          return res.json({ error: "Invalid email or password" });
        }
      });
    })
    .catch((err) => {
      res.json({ error: err });
    });
});

module.exports = router;
