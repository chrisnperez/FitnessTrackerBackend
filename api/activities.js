const express = require('express');
const router = express.Router();
const { getAllActivities } = require('../db')

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
    try{
        const activities = await getAllActivities();
        
        res.send(activities)

    } catch (error) {
        console.log(error);
        next(error);
    }
})

// GET /api/activities/:activityId/routines

// PATCH /api/activities/:activityId

module.exports = router;
