'use strict'
const
//Dependencias
express = require('express'),
MIDDLE = require('../middlewares/signature'),
WEBHOOK = require('../webhook/webhook');
//Usa las rutas de express
var route = express.Router();

//Verifica si el servidor está activo
route.get('/', (req, res) => {
	res.send('Servidor activo')
});
route.get('/webhook', WEBHOOK.verifyWebhook);
route.post('/webhook', MIDDLE.verifySignature, WEBHOOK.webhookMessaging);

module.exports = route;
