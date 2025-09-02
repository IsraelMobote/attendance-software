const utilities = require("../utilities/index")
const participantModel = require("../models/participant-model")
require("dotenv").config()


/* ****************************************
*  Participant Registration
* *************************************** */
async function registerParticipant(req, res) {
    const { par_name, par_number, par_ward, par_mrn, par_agegroup } = req.body

    const regResult = await participantModel.registerParticipant(
        par_name,
        par_ward,
        par_mrn,
        par_agegroup,
        par_number
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you're registered ${par_name}. Please mark attendance.`
        )
        res.status(201).render("index", {
            title: "Home",
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("index", {
            title: "Home",
        })
    }
}

module.exports = { registerParticipant }