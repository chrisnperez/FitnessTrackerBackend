const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    await client.query(`
    INSERT INTO users(username, password) 
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
    `, [username, password]);
  }
  catch (error) {
    console.log(error)
    throw error;
  }

}

// why did I need a console.log(error) --> ask allie

async function getUser({ username, password }) {

}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
