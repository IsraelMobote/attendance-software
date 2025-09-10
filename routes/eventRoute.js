const express = require("express")
const router = new express.Router()
const eventController = require("../controllers/eventController")

// route to get the event types
router.get("/getEventType/", eventController.getEventType);

module.exports = router