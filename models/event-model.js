const pool = require("../database/index")
require("dotenv").config()


/* *****************************
*   get event types
* *************************** */
async function getEventType() {
    try {
        const sql = `SELECT * FROM category`
        const data = await pool.query(sql)

        return data.rows
    } catch (error) {
        console.error("getNames error " + error)
    }
}

module.exports = { getEventType };
