const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'socialapp'
});


//conectar a la base de datos
mysqlConnection.connect((err) =>{
    if(err) {
        console.log(err);
        return;
    }else {
        console.log('Conectado correctamente');
    }
});

module.exports = mysqlConnection;