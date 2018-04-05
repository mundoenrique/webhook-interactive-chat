'use strict'
/**
 * Copyright 2018-present, mundoenrique.
 * All rights reserved.
 */

 const
  bodyParser = require('body-parser'),
  config = require('config'),
  express = require('express'),
  request = require('request'),
  //Puerto de la aplicación nodeJS
  APP_PORT = (process.env.APP_PORT) ? process.env.APP_PORT : config.get('appPort'),
  //Identificaodr de la aplicación messenger
  MSN_APP_ID = (process.env.MSN_APP_ID) ? process.env.MSN_APP_ID : config.get('msnAppId'),
  //Clave secreta de la aplicación MESSENGER
  MSN_APP_SECRET = (process.env.MSN_APP_SECRET) ? process.env.MSN_APP_SECRET : config.get('msnAppSecret'),
  //Token generado por el portal de facebook developers
  MSN_ACCESS_TOKEN = (process.env.MSN_ACCESS_TOKEN) ? process.env.MSN_ACCESS_TOKEN : config.get('msnAccessToken'),
  //Pagina de faebook asociada al bot
  FACEBOOK_PAGE = (process.env.FACEBOOK_PAGE) ? process.env.FACEBOOK_PAGE : config.get('faceBookPage'),
  //API ´de facebook
  FACEBOOK_API = (process.env.FACEBOOK_API) ? process.env.FACEBOOK_API : config.get('faceBookAPI'),
  //Token de validación del webhook
  WEBHOOK_TOKEN = (process.env.WEBHOOK_TOKEN) ? process.env.WEBHOOK_TOKEN : config.get('webHookToken'),
  //Url de la aplicación node
  SERVER_URL = (process.env.SERVER_URL) ? process.env.SERVER_URL : config.get('serverUrl');

if(!(MSN_APP_SECRET && MSN_ACCESS_TOKEN && MSN_ACCESS_TOKEN)) {
  console.error('Faltan valores de configuración');
  process.exit(1);
}

var app = express();
app.set('port', APP_PORT);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static('assets'));

//Iniciar el servidor
app.listen(app.get('port'), () => {
  console.log('La aplicación nodeJS está corriendo sobre el puerto ', app.get('port'));
});

//Recibir peticiones GET
app.get('/', (req, res) => {
	res.send('Servidor activo')
});

/*
 * Use your own validation token. Check that the token used in the Webhook
 *
 */
app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === WEBHOOK_TOKEN) {
    console.log("Webhook validado exitosamente");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("No fue posible validar el webhook. Asegurate de que el token coincida");
    res.sendStatus(403);
  }
});


