const utilities = require("../utilities/index")
const eventModel = require("../models/event-model")
const { name } = require("ejs")
require("dotenv").config()

/* *****************************
*   get event types
***************************** */
async function getEventType(req, res) {
    const eventTypes = await eventModel.getEventType()
    if (eventTypes) {
        return res.json(eventTypes)
    } else {
        next(new Error("No data returned"))
    }
}

module.exports = { getEventType }