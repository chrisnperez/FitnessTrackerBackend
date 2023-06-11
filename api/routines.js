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

        // console.log("creatorId", creatorId);
        // console.log("newRoutine: ", newRoutine);

        res.send(newRoutine);

    } catch ({ name, message }) {
        next ({ name, message });
    }
});

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
