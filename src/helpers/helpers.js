
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const pass = 'contrasena1'

const generarJWT = ( uid ) =>{

	return new Promise ((resolve, reject) =>{

		const payload = {
			uid
		};

		jwt.sign(payload, pass, {
			expiresIn: '12h'
		}, (err, token) => {

			if(err){
				console.log(err);
				reject('no se pudo generar el JWT');
			}else {
				resolve(token);
			}
		});

	});

}

module.exports= { generarJWT }



