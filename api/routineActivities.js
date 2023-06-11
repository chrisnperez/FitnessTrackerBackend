const express = require("express");
const router = express.Router();
const { updateRoutineActivity, getRoutineActivityById, getRoutineById, destroyRoutineActivity } = require("../db");
const { requireUser } = require("./utils");


router.use((req, res, next) => {
    console.log("A request has been made to /routine_activities");

    next();
});

// PATCH /api/routine_activities/:routineActivityId

router.patch("/:routineActivityId", requireUser, async (req, res, next) => {
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;
    const routineActivity = await getRoutineActivityById(routineActivityId);
    const { routineId } = routineActivity;

    try {
        const routine = await getRoutineById(routineId);
        if (req.user.id === routine.creatorId) {
            const updatedRoutineActivity = await updateRoutineActivity({ id: routineActivityId, count, duration });
            console.log(updatedRoutineActivity)
            res.send(updatedRoutineActivity);
        } else {
            res.send({
                error: "RoutineId Error",
                message: `User ${req.user.username} is not allowed to update In the evening`,
                name: "The same RoutineId Error"
            });
        }

    }
    catch (error) {
        next(error);
    }
});

// DELETE /api/routine_activities/:routineActivityId

router.delete("/:routineActivityId", requireUser, async (req, res, next) => {
    const { routineActivityId } = req.params;
    const routineActivity = await getRoutineActivityById(routineActivityId);
    try {
        const routine = await getRoutineById(routineActivity.routineId);
        if (req.user.id === routine.creatorId) {
            const deletedRoutineActivity = await destroyRoutineActivity(routineActivityId)
            res.send(deletedRoutineActivity);
        } else {
            res.status(403).send({
                error: "403 Error",
                message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
                name: "The same 403 Error",
            })
        }
    }
    catch (error) {
        next(error);
    }
})

module.exports = router;
