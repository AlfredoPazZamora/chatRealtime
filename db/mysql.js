let mysql = require('mysql');
let config = require('../config');

let connection = mysql.createConnection({
    host: config.HOST,
    user: config.USER,
    password: config.PW,
    database: config.DB
});

connection.connect(
    (err) => {
        if(err){
            console.log(err); 
            return;
        }else{
            console.log('BD esta conectada');
        }
    }
);

module.exports = connection;