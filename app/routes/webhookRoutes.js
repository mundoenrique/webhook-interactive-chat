'use strict'
const
  //Dependencias
  express = require('express'),
  webhook = require('../webhook/webhook')
;
//Usa las rutas de express
var route = express.Router();

//Verifica si el servidor está activo
route.get('/', (req, res) => {
	res.send('Servidor activo')
});
route.get('/webhook', webhook.verifyWebhook);
route.post('/webhook', webhook.webhookMessaging);

module.exports = route;
