
/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const app = express()
const env = require("dotenv").config()
const expressLayouts = require("express-ejs-layouts")
const bodyParser = require("body-parser")
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const participantRoute = require("./routes/participantRoute")
const eventRoute = require("./routes/eventRoute")
const pool = require("./database/")
const session = require("express-session")
const cookieParser = require("cookie-parser")


/* ***********************
 * Middleware
 * ************************/
app.use(session({
    store: new (require('connect-pg-simple')(session))({
        createTableIfMissing: true,
        pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'sessionId',
}))

// Express Messages Middleware
app.use(cookieParser())
app.use(require('connect-flash')())
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res)
    next()
})

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", baseController.buildHome)

//Participant route
app.use("/participant", participantRoute)

//event route
app.use("/event", eventRoute)

/**
 * server host name and port
 */
const HOST = 'localhost'
const PORT = 5500

/**
 * Log statement to confirm server operation
 */
app.listen(PORT, () => {
    console.log(`trial app listening on ${HOST} : ${PORT}`)
})

/**
 * Default GET route
 */
app.get("/", (req, res) => { res.send("Welcome home!") })