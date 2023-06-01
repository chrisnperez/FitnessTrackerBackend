const client = require("./client");
const bcrypt = require('bcrypt');

// database functions

// user functions
async function createUser({ username, password }) {

  try {

    const SALT_COUNT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

    const {rows: [user] } = await client.query(`
        INSERT INTO users(username, password) 
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `, [username, hashedPassword]);

        return user;
  }
  catch (error) {
    console.log(error)
    throw error;
  }

}

// why did I need a console.log(error) --> ask allie

async function getUser({ username, password }) {

  try {

    const user = await getUserByUserName(username);
    const hashedPassword = user.password;
    // isValid will be a boolean based on wether the password matches the hashed password
    const isValid = await bcrypt.compare(password, hashedPassword)

    if (isValid) {
      console.log('Passwords match!');
    } else {
      console.log('Passwords don\'t match');
    }

  } 
  catch (error) {
    console.log(error);
    throw error;
  }

}


async function getUserById(userId) {

}

async function getUserByUsername(userName) {

  try {
    const {rows: [user] } = await client.query(`
        SELECT * 
        FROM users
        WHERE username=$1
        RETURNING *;
        `, [userName]);

        return user;
  }
  catch (error) {
    console.log(error);
    throw error;
  }

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
