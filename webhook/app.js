'use strict'
/**
 * Copyright 2018-present, mundoenrique.
 * All rights reserved.
 */

 const
  bodyParser = require('body-parser'),
  config = require('config'),
  crypto = require('crypto'),
  express = require('express'),
  request = require('request'),
  webhookRoutes = require('./routes/webhookRoutes'),
  //Identificaodr de la aplicación messenger
  MSN_APP_ID = (process.env.MSN_APP_ID) ? process.env.MSN_APP_ID : config.get('msnAppId'),
  //Clave secreta de la aplicación MESSENGER
  MSN_APP_SECRET = (process.env.MSN_APP_SECRET) ? process.env.MSN_APP_SECRET : config.get('msnAppSecret'),
  //Pagina de faebook asociada al bot
  FACEBOOK_PAGE = (process.env.FACEBOOK_PAGE) ? process.env.FACEBOOK_PAGE : config.get('faceBookPage'),
  //Url de la aplicación node
  SERVER_URL = (process.env.SERVER_URL) ? process.env.SERVER_URL : config.get('serverUrl');

//Instancia express
var app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json({verify: verifyRequestSignature}));
app.use(express.static('assets'));

//Recibir peticiones GET
app.get('/', (req, res) => {
	res.send('Servidor activo')
});

app.use('/webhook', webhookRoutes);

//Verifica que la solicitud proviene de facebook a través de la clave secreta de la aplicación
function verifyRequestSignature(req, res, buf) {
  console.log('<<<<====Verificando firma de la solicitud====>>>');
  let signature = req.headers["x-hub-signature"];
  let msg = 'La firma es VÁLIDA';
  let valid = true;

  if (!signature) {
    msg = 'No existe la firma en la solictud.';
    valid = false;

  } else {
    let elements = signature.split('=');
    let method = elements[0];
    let signatureHash = elements[1];

    let expectedHash = crypto
      .createHmac('sha1', MSN_APP_SECRET)
      .update(buf)
      .digest('hex');

    if (signatureHash != expectedHash) {
      msg = 'La firma de la solicitud NO ES VÁLIDA.';
      valid = false;
    }
  }
  console.log(msg);
  console.log('------------------------------------------------');
}

module.exports = app;

