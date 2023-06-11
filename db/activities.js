const client = require('./client');


// database functions
async function createActivity({ name, description }) {
  try{
    const {rows:[activities] } = await client.query(`
    INSERT INTO activities(name,description)
    VALUES($1,$2)
    RETURNING *;
    `,[name, description]);  
    
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
    `, [id]); 
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
async function attachActivitiesToRoutines(routines) {
  try {
    const { rows: activities } = await client.query(`
      SELECT a.*, ra.duration, ra.count, ra."routineId", ra.id AS "routineActivityId"
      FROM activities a
      JOIN routine_activities ra ON ra."activityId" = a.id
      WHERE ra."routineId" IN (${routines.map(routine => routine.id).join(', ')});
    `);

    // Loop through the routines and attach the corresponding activities
    for (const routine of routines) {
      routine.activities = activities.filter(activity => activity.routineId === routine.id);
    }

    return routines;
  } catch (error) {
    console.log(error);
    throw error;
  }
}


async function updateActivity({ id, ...fields }) {
  // // don't try to update the id
  // // do update the name and description
  // // return the updated activity
  
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    // return early if this is called without fields
    if (setString.length === 0) {
      return;
    }
  
    try {
      const { rows: [ activity ] } = await client.query(`
        UPDATE activities
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
  
      return activity;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
