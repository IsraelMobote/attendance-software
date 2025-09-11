const utilities = require("../utilities/index")
const participantModel = require("../models/participant-model")
const { name } = require("ejs")
require("dotenv").config()


/* ****************************************
*  Participant Registration
* *************************************** */
async function registerParticipant(req, res) {
    const { par_name, par_number, par_ward, par_mrn, par_agegroup } = req.body

    const participantNames = await participantModel.getNames()

    let nameFound = 0
    participantNames.forEach(element => {
        if (element.par_name == par_name) {
            nameFound = 1
        }
    });

    if (nameFound == 0) {

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
                `Congratulations, you have registered ${par_name}. Please mark attendance.`
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
    else if (nameFound == 1) {
        req.flash(
            "notice",
            `${par_name} has already been taken, please use another name to register.
        You can consider adding a third name if you listed two names before`
        )
        res.status(201).render("index", {
            title: "Home",
        })
    }
}

/* ****************************************
*  Participant information updating
* *************************************** */
async function updateParticipant(req, res) {
    const { par_name, par_number, par_ward, par_mrn, par_agegroup, par_id } = req.body

    const participantNames = await participantModel.getNames()
    const originalName = await participantModel.getNameById(par_id)
    console.log(originalName)

    let nameFound = 0
    participantNames.forEach(element => {
        if (par_name != originalName.par_name && element.par_name == par_name) {
            nameFound = 1
        }
    });

    if (nameFound == 0) {
        const regResult = await participantModel.updateParticipantInfo(
            par_name,
            par_ward,
            par_mrn,
            par_agegroup,
            par_number,
            par_id
        )

        if (regResult) {
            req.flash(
                "notice",
                `Congratulations, you have updated ${par_name} information. You can proceed to mark attendance`
            )
            res.status(201).render("index", {
                title: "Home",
            })
        } else {
            req.flash("notice", "Sorry, the update failed.")
            res.status(501).render("index", {
                title: "Home",
            })
        }
    }
    else if (nameFound == 1) {
        req.flash(
            "notice",
            `${par_name} has already been taken, please use another name to update user.
        You can consider adding a third name if you listed two names before`
        )
        res.status(201).render("index", {
            title: "Home",
        })
    }
}

async function getNames(req, res) {
    const participantNames = await participantModel.getNames()
    if (participantNames) {
        return res.json(participantNames)
    } else {
        next(new Error("No data returned"))
    }
}


/* ****************************************
*  Attendance Submission to the database
* *************************************** */
async function submitAttendance(req, res) {
    console.log(5)
    const { par_event, att_list } = req.body

    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october',
        'november', 'december'
    ]

    const date = new Date()
    const att_year = date.getFullYear()

    // the date object only returns the month number not the name of the month
    const att_month = months[date.getMonth()]
    const att_day = date.getDay()
    const att_dayofmonth = date.getDate()

    console.log(par_event)
    const submResult = await participantModel.submitAttendance(par_event, att_day, att_dayofmonth, att_month, att_year, att_list)

    // you can log submResult to know of possible errors
    console.log(submResult)

    if (submResult) {
        req.flash(
            "notice",
            `Congratulations, you have submitted ${par_event} attendance for ${att_dayofmonth} ${att_month} ${att_year}.`
        )
        res.redirect('/')
    } else {
        req.flash("notice", "Sorry, the submission failed.")
        res.status(501).render("index", {
            title: "Home",
        })
    }
}

async function getUserInfo(req, res) {
    const par_name = req.params.par_name
    const par_Info = await participantModel.getUserInfo(par_name)

    if (par_Info) {
        return res.json(par_Info)
    } else {
        next(new Error("No data returned"))
    }
}

async function getAttDataByMonth(req, res) {
    const month = req.params.month
    const attendance_data = await participantModel.getAttDataByMonth(month)

    if (attendance_data) {
        return res.json(attendance_data)
    } else {
        next(new Error("No data returned"))
    }
}

module.exports = { registerParticipant, updateParticipant, getNames, submitAttendance, getUserInfo, getAttDataByMonth }