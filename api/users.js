/* eslint-disable no-useless-catch */
const express = require("express");
const { getUserByUsername, createUser, getUser, getUserById } = require("../db");
const router = express.Router();
const {getPublicRoutinesByUser,getAllRoutinesByUser} = require('../db');
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;


// POST /api/users/register

router.use((req, res, next) => {
    console.log("A request has been made to /users");

    next();
})

router.post("/register", async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const _user = await getUserByUsername(username);

        if (_user) {
            res.send({
                error: "UserExistError",
                message: `User ${username} is already taken.`,
                name: "This user already exists."
            });
        }

        if (password.length < 8) {
            res.send({
                error: "PasswordTooShort",
                message: "Password Too Short!",
                name: "Password does not meet length requirement"
            });
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
});

// GET /api/users/me

router.get('/me', async (req, res, next) => {
    const header = req.headers.authorization

    try {
        if (!header) {
            res.status(401)
            res.send({
                error: 'Token is missing',
                message: 'You must be logged in to perform this action',
                name: 'NoTokenError'
            })

        } else {
                const token = header.split(' ')[1];
                const decodedUser = jwt.verify(token, JWT_SECRET);
                res.send(decodedUser);
            }

    } catch ({ name, message }) {
        next({ name, message })
    }
});

// GET /api/users/:username/routines

router.get("/:username/routines", async (req, res, next) => {
  const { username } = req.params;
  const header = req.headers.authorization;
  let routines; 
  
  try {
    // Retrieve the user data based on the username
    const user = await getUserByUsername(username);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(header)
    routines = await getPublicRoutinesByUser({username});

     if (header) {
        const token = header.split(' ')[1];
        const decodedUser = jwt.verify(token, JWT_SECRET);
        if (decodedUser.id === user.id) {
            routines = await getAllRoutinesByUser({username}); 
        }
    }
      // Otherwise, retrieve public routines
    //   const routines = await getPublicRoutinesByUser(user.id);

    res.send(routines);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
