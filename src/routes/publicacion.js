const express = require('express');
const router = express.Router();

//traer la conexion a la BD
const mysqlConnection = require('../database')

router.get('/publicaciones', (req, res) => {
    mysqlConnection.query('SELECT * FROM publicacion', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }

    })
})

router.get('/publicaciones/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM publicacion WHERE idpublicacion = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }

    }
    )
})

router.post('/', (req, res) => {
    const {idetiquetas , nombreEtiqueta} = req.body;
    const query = 'CALL etiquetasAddOrEdit(?,?)';  
    
    mysqlConnection.query(query, [ idetiquetas, nombreEtiqueta], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Etiqueta guardada'})
        } else {
            console.log(err);
        }
    });
});


router.delete('/:idetiquetas', (req,res) => {
    const { idetiquetas } = req.params;
    mysqlConnection.query('DELETE FROM etiquetas WHERE etiquetas.idetiquetas = ?', [idetiquetas], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Etiqueta eliminada'})
        } else {
            console.log(err);
        }
    })
})

module.exports = router;