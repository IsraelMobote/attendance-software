const express = require("express")
const router = new express.Router()
const parController = require("../controllers/participantController")

// route to get the participant names list
router.get("/getNames/", parController.getNames);

//route for the post method in the register participant form
router.post("/register", parController.registerParticipant);

//route for the post method in the attendance form for participants
//router.post("/attendance", )

module.exports = router