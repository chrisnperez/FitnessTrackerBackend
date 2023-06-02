const client = require('./client');


// database functions
async function createActivity({ name, description }) {
  try{
    const {rows:[activities] } = await client.query(`
    INSERT INTO activities(name,description)
    VALUES($1,$2)
    RETURNING *;
    `,[name,description]);  
    
    return activities;
  }
  catch(error){    
    console.log(error);
    throw error;
  }
  
}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const {rows} = await client.query(`
    SELECT * FROM activities
    `);
    return rows;
  }
  catch(error){    
    console.log(error);
    throw error;
  }
}

async function getActivityById(id) {

try {
  const {rows:[activities] } = await client.query(`
    SELECT * 
    FROM activities
    WHERE id = ${id}
    `); 
  return activities;
}
catch(error){    
  console.log(error);
  throw error;
} 
}

async function getActivityByName(name) {
try {
  const {rows:[activities] } = await client.query(`
    SELECT * 
    FROM activities
    WHERE name = $1;
    `, [name]); 
  return activities;
}
catch(error){    
  console.log(error);
  throw error;
} 
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
