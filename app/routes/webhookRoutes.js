'use strict'
const
  express = require('express'),
  webhook = require('../webhook');

var route = express.Router();


route.get('/', webhook.verifyWebhook);
route.post('/', webhook.webhookMessaging);

module.exports = route;
