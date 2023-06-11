const express = require('express');
const routinesRouter = express.Router();
const { getAllPublicRoutines, createRoutine, updateRoutine, destroyRoutine, getRoutineById, addActivityToRoutine, getRoutineActivitiesByRoutine } = require("../db");
const { requireUser } = require("./utils");

routinesRouter.use((req, res, next) => {
    console.log("A request has been made to /routines");

    next();
})

// GET /api/routines 

routinesRouter.get("/", async (req, res, next) => {
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

routinesRouter.post("/", requireUser, async (req, res, next) => {
    console.log(req.body)
    const { isPublic, name, goal } = req.body;
    const creatorId = req.user.id;
    console.log(creatorId)
    try {
        const routine = await createRoutine({ creatorId, isPublic, name, goal });

        if (routine) {
            res.send(routine);
        } else {
            next(error);
        }
    }
    catch (error) {
        next(error);
    }
})

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
    const { routineId } = req.params;
    let routine = await getRoutineById(req.params.routineId);
    try {
        if (req.user.id === routine.creatorId) {
            const deleteRoutine = await destroyRoutine(routineId);
            res.send(deleteRoutine);
        } else {
            next({
                message: "You must be the creator of this routine to delete it"
            })
        }
    }
    catch (error) {
        next(error);
    }
});


// POST /api/routines/:routineId/activities

// router.post("/:routineId/activities", requireUser, async (req, res, next) => {
//     const routineId = req.params.routineId;
//     const { activityId, count, duration } = req.body;

//     try {
//         const routine = await getRoutineById(routineId);
//         const activity = await addActivityToRoutine({ routineId, activityId, count, duration });

//         if (req.user.id === routine.creatorId) {
//             res.send(activity);
//         } else {
//             next(error);
//         }
//     }
//     catch (error) {
//         next(error);
//     }
// });

module.exports = routinesRouter;
