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


//function to update participant information in participant table
/* *****************************
*   update Participant Information
* *************************** */
async function updateParticipantInfo(par_name, par_ward, par_mrn, par_agegroup, par_number, par_id) {
    try {
        const sql = `UPDATE participant SET par_name = $1, par_ward = $2, par_mrn = $3, par_agegroup = $4, par_number = $5 WHERE par_id = $6 RETURNING *`
        return await pool.query(sql, [par_name, par_ward, par_mrn, par_agegroup, par_number, par_id])
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


/* *****************************
*   get participant name by id
* *************************** */
async function getNameById(par_id) {
    try {
        const sql = `SELECT par_name FROM participant WHERE par_id = $1`
        const data = await pool.query(sql, [par_id])

        return data.rows[0]
    } catch (error) {
        console.error("getNameById error " + error)
    }
}

/* *****************************
*   get participant names
* *************************** */
async function getUserInfo(par_name) {
    try {
        const sql = `SELECT * FROM participant WHERE par_name = $1`
        const data = await pool.query(sql, [par_name])

        return data.rows[0]
    } catch (error) {
        console.error("getUserInfo error " + error)
    }
}

//function to insert new daily attendance in the appropriate table
/* *****************************
*   daily attendance submission
* *************************** */
async function submitAttendance(par_event, att_day, att_dayofmonth, att_month, att_year, att_list) {
    try {
        if (par_event == 'skillAcquisition') {
            const sql = `INSERT INTO skill_attendance (att_day, att_dayofmonth, att_month, att_year, att_list) VALUES ($1, $2, $3, $4, $5) RETURNING *`
            return await pool.query(sql, [att_day, att_dayofmonth, att_month, att_year, att_list])
        }
        else if (par_event == 'institute') {
            const sql = `INSERT INTO institute_attendance (att_day, att_dayofmonth, att_month, att_year, att_list) VALUES ($1, $2, $3, $4, $5) RETURNING *`
            return await pool.query(sql, [att_day, att_dayofmonth, att_month, att_year, att_list])
        }
        else if (par_event == 'family-history-and-temple') {
            const sql = `INSERT INTO family_history_attendance (att_day, att_dayofmonth, att_month, att_year, att_list) VALUES ($1, $2, $3, $4, $5) RETURNING *`
            return await pool.query(sql, [att_day, att_dayofmonth, att_month, att_year, att_list])
        }
        else if (par_event == 'self_reliance') {
            const sql = `INSERT INTO self_reliance_attendance (att_day, att_dayofmonth, att_month, att_year, att_list) VALUES ($1, $2, $3, $4, $5) RETURNING *`
            return await pool.query(sql, [att_day, att_dayofmonth, att_month, att_year, att_list])
        }
    } catch (error) {
        return error.message
    }
}

async function getAttDataByMonth(month) {
    try {
        let totalData = []
        const sql = `SELECT * FROM skill_attendance WHERE att_month = $1`
        const data = await pool.query(sql, [month])

        const sql_two = `SELECT * FROM institute_attendance WHERE att_month = $1`
        const data_two = await pool.query(sql_two, [month])

        const sql_three = `SELECT * FROM family_history_attendance WHERE att_month = $1`
        const data_three = await pool.query(sql_three, [month])

        totalData.push(data)
        totalData.push(data_two)
        totalData.push(data_three)

        return totalData
    } catch (error) {
        console.error("getAttDataByMonth error " + error)
    }
}

async function getParNameByWard(ward) {
    try {
        const sql = `SELECT par_name FROM participant WHERE par_ward = $1`
        const data = await pool.query(sql, [ward])

        return data.rows
    } catch (error) {
        console.error("getParNameByWard error " + error)
    }
}
module.exports = { registerParticipant, updateParticipantInfo, getNames, getNameById, getUserInfo, getAttDataByMonth, getParNameByWard, submitAttendance };

