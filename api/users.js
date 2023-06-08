/* eslint-disable no-useless-catch */
const express = require("express");
const { getUserByUsername, createUser, getUser } = require("../db/users");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;


// POST /api/users/register


router.use((req, res, next) => {
    console.log("A request has been made to /users");

    next();
})

router.post("/register", async (req, res, next) => {
    const { username, password } = req.body;
    console.log(password);

    try {
        const _user = await getUserByUsername(username);

        if (_user) {
            throw new Error({
                error: "User already exists",
                message: "UserExistsError",
                name: "User already exists"
            })
        }
        if (password.length < 8) {
            throw new Error({
                error: "Password requirement not met",
                name: "PasswordLengthError",
                message: "password length must be at least 8 characters long"
            })
        }

        const user = await createUser({
            username,
            password
        });

        const token = jwt.sign({
            id: user.id,
            username
        }, process.env.JWT_SECRET, {
            expiresIn: "1w"
        });

        res.send({
            message: "You Successfully Registered!",
            user,
            token,
        });
    }
    catch ({ name, message }) {
        next({ name, message })
    }
});

// router.post('/register', async(req, res, next) =>{
//   const {username, password} = req.body; 
//   try {
//     const _user = getUserByUsername(username);

//     if (_user){
//       next({
//         name: 'UserExistsError',
//         message: 'A user by that username already exists'
//       })
//     }
//     const user = await  createUser({
//       username,password
//     });
//     console.log(user);
//     const token = jwt.sign({
//       id: user.id,
//       username
//     }, process.env.JWT_SECRET, {
//       expiresIn: '1w'
//     });
//     console.log(token);
//     res.send({
//       user:{
//         id: user.id,
//         username: user.username
//       },
//       message: "Thanks for signing up for our service",
//       token
//     });
//   }
//   catch ({name, message}){
//     next({name, message})
//   }
// });



// POST /api/users/login

router.post("/login", async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
        });
    }

    try {
        const user = await getUser({ username, password });

        const token = await jwt.sign(user, process.env.JWT_SECRET);

        if (user) {
            res.send({
                user: {
                    id: user.id,
                    username: user.username
                },
                message: "you're logged in!",
                token: token
            });
        } else {
            next({
                name: "IncorrectCredentialsError",
                message: "Username or password is incorrect"
            })
        }
    }
    catch ({ name, message }) {
        ({ name, message });
    }
})

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
