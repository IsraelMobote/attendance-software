const pool = require("../database/index")
require("dotenv").config()

//function to insert new participant in participant table
/* *****************************
*   Register New Participant
* *************************** */
async function registerParticipant() {
    try {
        const sql = `INSERT INTO participant (par_name, par_mrn, par_ward, par_agegroup, par_class) VALUES ($1, $2, $3, $4, $5) RETURNING *`
        return await pool.query(sql, ['Israel', '01101010', 'Meiran', '18-24', 'makeup'])
    } catch (error) {
        return error.message
    }
}

module.exports = { registerParticipant };

