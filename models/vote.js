const db = require('../db/database.js');
const db2 = require('../db/mssqlDB.js')
const sql = require('mssql')

class Voting {
    static store_resp(responses, callback) {
        db.query('INSERT INTO SurveyResponses SET ?', responses, callback);
    }

    static insertEmptyResponse(responses, callback) {
        db.query('INSERT INTO SurveyResponses SET ?', responses, (err, result) => {
            if (err) {
                callback(err);
            } else {
                callback(null, result.insertId);
            }
        });
    }

    static updateResponse(responseId, data, callback) {
        db.query('UPDATE SurveyResponses SET ? WHERE id = ?', [data, responseId], callback);
    }

    // MSSQL database get data with integer part_no
    static get_name_data_part_no_wise(part_no, callback) {
        // Create a new request from the connection pool
        db2.connect().then(pool => {
            return pool.request()
                .input('PART_NO', sql.Int, part_no) // Use sql.Int for integer data
                .query('SELECT FIRSTNAME_EN FROM HR_AC_Data WHERE PART_NO = @PART_NO');
        }).then(result => {
            callback(null, result.recordset); // Pass the result to the callback
        }).catch(err => {
            callback(err); // Handle errors
        }).finally(() => {
            db2.close(); // Ensure the connection is closed
        });
    }

    static get_name_data(callback) {
        // MSSQl query to get the name from the Names Table
        db2.connect().then(pool => {
            return pool.request()
                .query('SELECT name FROM Names');
        }).then(result => {
            callback(null, result.recordset); // Pass the result to the callback
        }).catch(err => {
            callback(err); // Handle errors
        }).finally(() => {
            db2.close(); // Ensure the connection is closed
        });
    }

}

module.exports = Voting;