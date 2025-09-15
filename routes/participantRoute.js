const express = require("express")
const router = new express.Router()
const parController = require("../controllers/participantController")

// route to get the participant names list
router.get("/getNames/", parController.getNames);

// route to get the participant information with the name
router.get("/getNameInfo/:par_name", parController.getUserInfo);

//route for the post method in the attendance form for participants
router.post("/attendance", parController.submitAttendance);

//route for the post method in the register participant form
router.post("/register", parController.registerParticipant);

//route for the post method in the register participant form
router.post("/update", parController.updateParticipant);

//route to get the attendance data by month
router.get("/getAttendanceData/:month", parController.getAttDataByMonth);

//route to get the name of participants by ward
router.get("/getParNameByWard/:ward", parController.getParNameByWard);

module.exports = router