const router = require('express').Router(),
    bcrypt = require('bcrypt'),
    crypto = require('crypto');

const { generarJWT } = require('../helpers/helpers');
/* validamos datos */
const { validarJWT } = require('../middlewares/valida-jwt');

//traer la conexion a la BD
const mysqlConnection = require('../database');


// LOGIN 


router.post('/login', async (req, res = response) => {

    /* Aquí verificamos que estos dos datos son necesarios */
    if (req.body.correo == null || req.body.contrasena == null) {        
        return res.send({ error: true, message: 'Invalid request.' });
    }

    const { correo, contrasena } = req.body; /* desestructuramos */

    try{
        
        const dataDB = await new Promise( (resolve,  reject)=>{
            // mysqlConnection.query('SELECT * FROM USUARIO WHERE correo = "' + req.body.usuario + '" and password ="' + req.body.contrasena + '"', (err, rows, fields) => {
            mysqlConnection.query(`SELECT * FROM usuario WHERE correo = ?`, [correo],
                                            (err, rows) => {         
                if(err){
                    console.log("error");
                    reject(err);
                }else{
                    /* el correo tiene que ser valor único */
                    resolve(rows[0]);
                }
            })
        });

        if(!dataDB){
           return res.status(400).json({
                        error: true,
                        message: 'Correo o contraseña invalido'
            });
        }
        /** Verificamos la contraseña que propusimos con el que esta en la DB */
        const validarContrasenha = bcrypt.compareSync(contrasena, dataDB.contrasena);
        if(!validarContrasenha){
            return res.send({ error: true, contrasena,  pass: dataDB.contrasena,  message: 'Contraseña invalido' });
        }

        /***/
        const token = await generarJWT(dataDB.idusuario);
            //TODO: Guardar el token en la db o algun lugar donde vos peudas relacionar el usuario al token

        res.json({
            dataDB: dataDB,
            token
        });

        // console.log(dataDB);

    }catch(error){
        console.log(error);
        res.status(500).json({
            error: true,
            message: 'Error grave'
        });
    }

    


    


})


// REGISTER

router.post('/register', async(req, res) => {

    const dataDB = req.body;

    // const query = `INSERT INTO usuario (idusuario, nombres, apellido_p, apellido_m, rut, correo, password, telefono, tipoUsuario, region_idregion, genero) values (?,?,?,?,?,?,?,?,?,?,?)`;
    const query = `INSERT INTO usuario SET ?`;
    
    // const query = 'CALL usuario(?,?,?,?,?,?,?,?,?)';
    try{
        /** opcional:
         *  Podemos condicionar los datos necesarios creando un model (o podemos hacerlo en el Frontend)
         *   es necesario seguir validando los otros datos requeridos
         *  */
        if(!dataDB || !dataDB.contrasena || dataDB.contrasena === null || !dataDB.correo){
            return res.status(400).json({
                        error: true,
                        message: 'Error grave'
                    });
        }
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        dataDB.contrasena = bcrypt.hashSync( dataDB.contrasena, salt );

        await new Promise( (resolve,  reject)=>{
            // mysqlConnection.query('SELECT * FROM USUARIO WHERE correo = "' + req.body.usuario + '" and password ="' + req.body.contrasena + '"', (err, rows, fields) => {
            mysqlConnection.query( query, [dataDB],
                                            async (err, rows) => {         
                if(err){
                    console.log("error");
                    reject(err);
                    return res.status(500).json({
                        error: true,
                        message: 'Error grave'
                    });
                }else{
                    /* el correo tiene que ser valor único */
                    resolve();
                    const token = await generarJWT(dataDB.idusuario);
        //TODO: Guardar el token en la db o algun lugar donde vos peudas relacionar el usuario al token

                    return res.json({
                        dataDB: dataDB,
                        token
                    });
                }
            })
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            error: true,
            message: 'Error grave'
        });
    }

})







// DIRECCIONES

    //Buscar direccion 

    //buscar direcciones

//CREAR O EDITAR DIRECCION

router.post('/direccion', [ validarJWT ], (req, res) => {
    const { iddireccion, calle , numero, codigoPostal, comuna_idcomuna } = req.body;
    const query = 'CALL direccionAddOrEdit(?,?,?,?,?)';

    mysqlConnection.query(query, [iddireccion, calle, numero, codigoPostal, comuna_idcomuna], (err, rows, fields) => {
        if (!err) {
            res.json({ Status: 'Direccion guardada' })
        } else {
            console.log(err);
        }
    });
});




// PUBLICACIONES 
router.get('/publicaciones', [ validarJWT ], (req, res) => {
    mysqlConnection.query('SELECT * FROM publicacion', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }

    })
})

router.get('/publicaciones/:id', [ validarJWT ], (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM publicacion WHERE idpublicacion = ?', [id], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }

    }
    )
})

// Publicaciones de un usuario

router.get('/usuarios/:id/posts', [ validarJWT ], (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM publicacion WHERE usuario_idusuario = ?', [id], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }

    }
    )
})


router.post('/publicaciones', [ validarJWT ], (req, res) => {
    const { idpublicacion, titulo, cuerpo, precio, imagenURL, usuario_idusuario, tipoPublicacion_idtipoPublicacion } = req.body;
    const query = 'CALL publicacionAddOrEdit(?,?,?,?,?,?,?)';

    mysqlConnection.query(query, [idpublicacion, titulo, cuerpo, precio, imagenURL, usuario_idusuario, tipoPublicacion_idtipoPublicacion], (err, rows, fields) => {
        if (!err) {
            res.json({ Status: 'Publicacion guardada' })
        } else {
            console.log(err);
        }
    });
});

// USUARIOS
router.get('/usuarios', [ validarJWT ], (req, res) => {
    mysqlConnection.query('SELECT * FROM usuario', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }

    })
})

router.get('/usuarios/:id', [ validarJWT ], (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM usuario WHERE idusuario = ?', [id], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }

    }
    )
})

//AGREGAR O EDITAR PUBLICACION. 

router.post('/usuarios', [ validarJWT ], (req, res) => {
    const { idpublicacion, titulo, cuerpo, precio, imagenURL, usuario_idusuario, tipoPublicacion_idtipoPublicacion } = req.body;
    const query = 'CALL publicacionAddOrEdit(?,?,?,?,?,?,?)';

    mysqlConnection.query(query, [idpublicacion, titulo, cuerpo, precio, imagenURL, usuario_idusuario, tipoPublicacion_idtipoPublicacion], (err, rows, fields) => {
        if (!err) {
            res.json({ Status: 'Publicacion guardada' })
        } else {
            console.log(err);
        }
    });
});



// ETIQUETAS
router.get('/etiquetas', [ validarJWT ], (req, res) => {
    mysqlConnection.query('SELECT * FROM etiquetas', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }

    })
})

router.get('/etiquetas/:id', [ validarJWT ], (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM etiquetas WHERE idetiquetas = ?', [id], (err, rows, fields) => {
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
        }

    }
    )
})

router.post('/etiquetas', [ validarJWT ], (req, res) => {
    const { idetiquetas, nombreEtiqueta } = req.body;
    const query = 'CALL etiquetasAddOrEdit(?,?)';

    mysqlConnection.query(query, [idetiquetas, nombreEtiqueta], (err, rows, fields) => {
        if (!err) {
            res.json({ Status: 'Etiqueta guardada' })
        } else {
            console.log(err);
        }
    });
});


router.delete('/etiquetas/:idetiquetas', [ validarJWT ], (req, res) => {
    const { idetiquetas } = req.params;
    mysqlConnection.query('DELETE FROM etiquetas WHERE etiquetas.idetiquetas = ?', [idetiquetas], (err, rows, fields) => {
        if (!err) {
            res.json({ Status: 'Etiqueta eliminada' })
        } else {
            console.log(err);
        }
    })
})



module.exports = router;