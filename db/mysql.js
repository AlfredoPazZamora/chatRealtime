let mysql = require('mysql');
let config = require('../config');

let connection = mysql.createConnection({
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'be6e7059cd1c8a',
    password: '94db54d6',
    database: 'heroku_08b9a5b304298d8'
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