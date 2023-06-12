const express = require('express');
const router = express.Router();
const { getAllPublicRoutines, createRoutine, updateRoutine, destroyRoutine, getRoutineById, addActivityToRoutine, getRoutineActivitiesByRoutine } = require("../db");
const { requireUser } = require("./utils");

router.use((req, res, next) => {
    console.log("A request has been made to /routines");

    next();
})

// GET /api/routines 

router.get("/", async (req, res, next) => {
    try {
        const routines = await getAllPublicRoutines();

        if (routines) {
            res.send(routines);
        } else {
            next(error);
        }
    }
    catch (error) {
        next(error);
    }
});

// POST /api/routines

router.post("/", requireUser, async (req, res, next) => {
    const { isPublic, name, goal } = req.body;
    const creatorId = req.user.id;
  
    try {
        const newRoutine = await createRoutine({
            creatorId,
            isPublic,
            name,
            goal,
        });

        res.send(newRoutine);

    } catch ({ name, message }) {
        next ({ name, message });
    }
});

// PATCH /api/routines/:routineId
router.patch("/:routineId", requireUser, async (req, res, next) => {
    try {
      const { routineId } = req.params;
      const { isPublic, name, goal } = req.body;
  
      // Check if the routine exists

      const existingRoutine = await getRoutineById(routineId);
            // Check if the logged-in user is the owner of the routine
      if (existingRoutine.creatorId !== req.user.id) {
        return res.status(403).json({
          error: "UnauthorizedError",
          message: "User " + req.user.username + " is not allowed to update " + existingRoutine.name,
          name: "Unauthorized",
        });
      }
      // Update the routine
      const updatedRoutine = await updateRoutine({
        id: routineId,
        isPublic,
        name,
        goal,
      });
  
      res.send(updatedRoutine);
    } catch (error) {
      next(error);
    }
  });
// DELETE /api/routines/:routineId

router.delete("/:routineId", requireUser, async (req, res, next) => {
    const { routineId } = req.params;
  
    try {
      const routine = await getRoutineById(routineId);
  
      if (req.user.id === routine.creatorId) {
        await destroyRoutine(routineId);
        res.send({
          creatorId: routine.creatorId,
          goal: routine.goal,
          id: routine.id,
          isPublic: routine.isPublic,
          name: routine.name
        });
      } else {
        res.status(403).send({
          error: "403 Error",
          message: "User " + req.user.username + " is not allowed to delete " + routine.name,
          name: "The same 403 Error",
        });
      }
    } catch (error) {
      next(error);
    }
  });



// POST /api/routines/:routineId/activities

router.post("/:routineId/activities", requireUser, async (req, res, next) => {
    const { routineId } = req.params;
    const { activityId, count, duration } = req.body;
  
    try {
  
      const tempActivities = await getRoutineActivitiesByRoutine({ id: routineId });
      const foundActivity = tempActivities.find(activity => activity.activityId === activityId);
  
      if (foundActivity) {
        return res.json({
          error: "DuplicateActivityError",
          message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
          name: "DuplicateActivity",
        });
      }
      else {
        const routine_activity = await addActivityToRoutine({routineId, activityId, count, duration});
  
        res.send(routine_activity);
      }
      
    } catch (error) {
      next(error);
    }
  });



module.exports = router;
