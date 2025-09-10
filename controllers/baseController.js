const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function (req, res) {
    res.status(201).render("index", {
        title: "Home",
    })
}

module.exports = baseController