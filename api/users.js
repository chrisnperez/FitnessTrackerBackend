/* eslint-disable no-useless-catch */
const express = require("express");
const { getUserByUsername, createUser } = require("../db/users");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = process.env;


// POST /api/users/register

router.post('/register', async(req, res, next) =>{
  const {username, password} = req.body; 
  try {
    const _user = getUserByUsername(username);

    if (_user){
      next({
        name: 'UserExistsError',
        message: 'A user by that username already exists'
      })
    }
    const user = await  createUser({
      username,password
    });
    console.log(user);
    const token = jwt.sign({
      id: user.id,
      username
    }, process.env.JWT_SECRET, {
      expiresIn: '1w'
    });
    console.log(token);
    res.send({
      user:{
        id: user.id,
        username: user.username
      },
      message: "Thanks for signing up for our service",
      token
    });
  }
  catch ({name, message}){
    next({name, message})
  }
});
// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
