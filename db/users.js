const client = require("./client");
const bcrypt = require('bcrypt');



// database functions

// user functions
const createUser = async ({ username, password }) => {

  try {

    const SALT_COUNT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

    const { rows: [user] } = await client.query(`
        INSERT INTO users(username, password) 
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `, [username, hashedPassword]);

    delete user.password;

    return user;
  }
  catch (error) {
    console.log(error)
    throw error;
  }

}

// why did I need a console.log(error) --> ask allie


const getUserByUsername = async (userName) => {

  try {
    const { rows: [user] } = await client.query(`
        SELECT * 
        FROM users
        WHERE username=$1
        `, [userName]);

    return user;
  }
  catch (error) {
    console.log(error);
    throw error;
  }

}



const getUser = async ({ username, password }) => {

  try {

    const user = await getUserByUsername(username);
    const hashedPassword = user.password;
    // isValid will be a boolean based on wether the password matches the hashed password
    const isValid = await bcrypt.compare(password, hashedPassword)

    if (isValid) {
      console.log('Passwords match!');
      delete user.password;
      return user;
    } else {
      console.log('Passwords don\'t match');
    }

  }
  catch (error) {
    console.log(error);
    throw error;
  }

}


const getUserById = async (userId) => {
  console.log(userId)

  try {
    const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE id=${userId};
    `)
    delete user.password; 
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
