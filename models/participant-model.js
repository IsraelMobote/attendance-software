const pool = require("../database/index")
require("dotenv").config()

//function to insert new participant in participant table
/* *****************************
*   Register New Participant
* *************************** */
async function registerParticipant(par_name, par_ward, par_mrn, par_agegroup, par_number) {
    try {
        const sql = `INSERT INTO participant (par_name, par_ward, par_mrn, par_agegroup, par_number) VALUES ($1, $2, $3, $4, $5) RETURNING *`
        return await pool.query(sql, [par_name, par_ward, par_mrn, par_agegroup, par_number])
    } catch (error) {
        return error.message
    }
}

/* *****************************
*   get participant names
* *************************** */
async function getNames() {
    try {
        const sql = `SELECT par_name FROM participant`
        const data = await pool.query(sql)
    
        return data.rows
    } catch (error) {
        console.error("getNames error " + error)
    }
}

module.exports = { registerParticipant, getNames };

