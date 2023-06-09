const express = require('express');
const router = express.Router();
const { getAllActivities, getActivityByName, createActivity } = require('../db')

router.use((req, res, next) => {
    console.log("A request has been made to /activities");

    next();
})


// GET /api/activities

router.get("/", async (req, res, next) => {
    try{
        const activities = await getAllActivities();
        
        res.send(activities)

    } catch (error) {
        console.log(error);
        next(error);
    }
})


// POST /api/activities

router.post("/", async (req, res, next) => {
    const { name, description } = req.body;
    const activities = { name, description }

    try{
        const activity = await getActivityByName(name);

        if(activity){
            res.send({
                error: "not right",
                message: `An activity with name ${name} already exists`, 
                name: "definitely wrong"
            })
        }
        
        const createdActivity = await createActivity(activities); 

        res.send(createdActivity)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// GET /api/activities/:activityId/routines

// PATCH /api/activities/:activityId

module.exports = router;
