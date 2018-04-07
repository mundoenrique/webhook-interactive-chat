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
  webhookRoutes = require('./routes/webhookRoutes'),
  //Identificaodr de la aplicación messenger
  MSN_APP_ID = (process.env.MSN_APP_ID) ? process.env.MSN_APP_ID : config.get('msnAppId'),
  //Pagina de faebook asociada al bot
  FACEBOOK_PAGE = (process.env.FACEBOOK_PAGE) ? process.env.FACEBOOK_PAGE : config.get('faceBookPage'),
  //Url de la aplicación node
  SERVER_URL = (process.env.SERVER_URL) ? process.env.SERVER_URL : config.get('serverUrl');

//Instancia express
var app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('assets'));

//Recibir peticiones GET
app.get('/', (req, res) => {
	res.send('Servidor activo')
});

app.use('/webhook', webhookRoutes);

module.exports = app;

