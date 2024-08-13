const db = require('../db/database.js');

class Voting {
    static store_resp(responses, callback){
        db.query('INSERT INTO SurveyResponses SET ?', responses, callback);
    }
}

module.exports = Voting;