const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');



// Configuracion servidor
    //Si hay puerto disponible lo toma, sinó usa el 3000
app.set('port', process.env.PORT || 3000);


// Middlewares - Funciones que se ejecutan antes de que se procese algo
    //Metodo para convertir json
app.use(express.json());

// Routes     - Rutas 
app.use(require('./routes/users'));

app.use(require('./routes/publicacion'));


//inciar servidor
app.listen(app.get('port'), () =>{
    console.log('Server on port ', app.get('port'));
});




// test

