const utilities = require("../utilities/")
const baseController = {}
const participantModel = require("../models/participant-model")

baseController.buildHome = async function (req, res) {
    const result = await participantModel.registerParticipant()
    console.log(result)
    res.render("index", { title: "Home" })
}

module.exports = baseController