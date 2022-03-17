const mysql = require('mysql');
const app = require('../app');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'Seg2424!!',
    database: 'crud-final'
});

connection.connect(function(error){
    if(!error){
        console.log(error);
    }else{
        console.log('connected..! to port 3000')
    }
});

module.exports=connection;

