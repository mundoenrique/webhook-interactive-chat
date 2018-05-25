'use strict'
const
//dependencias
config = require('config'),
crypto = require('crypto'),
//Clave secreta de la aplicación MESSENGER
MSN_APP_SECRET = (process.env.MSN_APP_SECRET) ? process.env.MSN_APP_SECRET : config.get('msnAppSecret');

csonsole.log(MSN_APP_SECRET);

var
verifySignature = (req, res, next) => {
  let
  signature = req.headers["signature-valid"];

  if(!signature) {
    console.log('--------Rechazando la solicitud--------');
    console.log(`Signature ${signature}`);
    console.log('------------------------------------------------------------------------');
    return res.status(403).send({message: 'Forbidden access'});
  }
  next();
}

module.exports = ({verifySignature});

