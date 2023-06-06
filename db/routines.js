const { attachActivitiesToRoutines } = require("./activities");
const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try{
    const {rows:[routines] } = await client.query(`
    INSERT INTO routines("creatorId","isPublic", name, goal)
    VALUES($1,$2,$3,$4)
    RETURNING *;
    `,[creatorId,isPublic,name,goal]);  
    
    return routines;
  }
  catch(error){    
    console.log(error);
    throw error;
  }

}
//this function is not in routines.spec(not being used)
async function getRoutineById(id) {
  try{
    const {rows:[routine] } = await client.query(
    `
      SELECT *  
      FROM routines
      WHERE id= ${id};
      `
    );
      return routine;
  }
  catch(error){    
    console.log(error);
    throw error;
  }
  

}


async function getRoutinesWithoutActivities() {
  try{
    const {rows } = await client.query(
    `
      SELECT *  
      FROM routines;
      `
    );
      return rows;
  }
  catch(error){    
    console.log(error);
    throw error;
  }
  

}

async function getAllRoutines() {
  try{
    const {rows:routines } = await client.query(
      `
      SELECT r.*, u.username AS "creatorName"
      FROM routines r
      INNER JOIN users u
      ON r."creatorId" = u.id; 
    
      `
    );
    const workoutStuff = await attachActivitiesToRoutines(routines);
      return workoutStuff;

  }
  catch(error){    
    console.log(error);
    throw error;
  }
  
}

async function getAllPublicRoutines() {
  try{
    const {rows:routines } = await client.query(
      `
      SELECT r.*, u.username AS "creatorName"
      FROM routines r
      INNER JOIN users u
      ON r."creatorId" = u.id
      WHERE r."isPublic" = true;
    
      `
    );
    const workoutStuff = await attachActivitiesToRoutines(routines);
      return workoutStuff;

  }
  catch(error){    
    console.log(error);
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try{
    const {rows:routines } = await client.query(
      `
      SELECT r.*, u.username AS "creatorName"
      FROM routines r
      INNER JOIN users u
      ON r."creatorId" = u.id 
      WHERE u.username = $1;   
      `
    ,[username]);
    const workoutStuff = await attachActivitiesToRoutines(routines);
      return workoutStuff;

  }
  catch(error){    
    console.log(error);
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try{
    const {rows:routines } = await client.query(
      `
      SELECT r.*, u.username AS "creatorName"
      FROM routines r
      INNER JOIN users u
      ON r."creatorId" = u.id   
      WHERE r."isPublic" = true;
      `
    );
    const workoutStuff = await attachActivitiesToRoutines(routines);
      return workoutStuff;

  }
  catch(error){    
    console.log(error);
    throw error;
  }

}

async function getPublicRoutinesByActivity({ id }) {
  try{
    const {rows:routines } = await client.query(
      `
      SELECT r.*, u.username AS "creatorName"
      FROM routines r
      INNER JOIN users u
      ON r."creatorId" = u.id   
      WHERE r."isPublic" = true;
      `
      );
    
    const workoutStuff = await attachActivitiesToRoutines(routines); 
    const filteredRoutines = workoutStuff.filter(routine =>
      routine.activities.some(activity => activity.id === id)
  );
  return filteredRoutines;

  }

  
  catch(error){    
    console.log(error);
    throw error;
  }
}


async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
