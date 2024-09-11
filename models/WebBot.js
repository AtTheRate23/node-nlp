const db = require('../db/database.js');

class ChatBot {
    static createChat(payload, callback) {
        const sql = `INSERT INTO chat_bot_responses SET ?`;
        db.query(sql, payload, (err, result) => {
            if (err) throw err;
            console.log(`Inserted ${result.affectedRows} rows into responses.`);
            callback(null, result);
        });
    }

    //update reponse through id
    static InsertChats(payload, callback) {
        const sql = `INSERT INTO chats SET ?`;
        db.query(sql, payload, (err, result) => {
            if (err) throw err;
            console.log(`Updated ${result.affectedRows} rows in responses.`);
            callback(null, result);
        });
    }
}

module.exports = ChatBot;