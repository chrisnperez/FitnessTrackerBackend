const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try{
    const {rows:[routine_activities] } = await client.query(`
    INSERT INTO routine_activities("routineId","activityId", count, duration)
    VALUES($1,$2,$3,$4)
    RETURNING *;
    `,[routineId,activityId,count,duration]);  
    
    return routine_activities;
  }
  catch(error){    
    console.log(error);
    throw error;
  }

}

async function getRoutineActivityById(id) {
  try{
    const {rows:[routine_activities] } = await client.query(
      `
      SELECT ra.*
      FROM routine_activities ra
      WHERE id= ${id}
    `);  
    
    return routine_activities;
  }
  catch(error){    
    console.log(error);
    throw error;
  }

}


async function getRoutineActivitiesByRoutine({ id }) {
  try{
    const {rows:routines } = await client.query(
      `
      SELECT ra.*
      FROM routine_activities ra
      WHERE id= ${id}
    `);  
    
    return routines;
  }
  catch(error){    
    console.log(error);
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [ activity ] } = await client.query(`
      UPDATE routine_activities
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

async function destroyRoutineActivity(id) {
  try {
    
    const {rows: [routine_activities] } = await client.query(
        `
        DELETE FROM routine_activities
        WHERE "routineId" = $1
        RETURNING *;
        `,[id]
      )   


    return routine_activities;

  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {

  
  try {
    const { rows: [ activity ] } = await client.query(`
     SELECT * 
     FROM routine_activities
     WHERE id =$1
    `,[userId]);
    if(activity && activity.id === userId){
      return true;
    }
    
    return false;

  } catch (error) {
    console.log(error);
    throw error;
  }



}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
