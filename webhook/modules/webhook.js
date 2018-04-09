'use strict'
const
  config = require('config'),
  moment = require('moment'),
  API = require('./connectAPIS'),
  EVENTS = require('./handleEvents'),
  //Token de validación del webhook
  WEBHOOK_TOKEN = (process.env.WEBHOOK_TOKEN) ? process.env.WEBHOOK_TOKEN : config.get('webHookToken');
/*
 * Generar un TOKen para validar la petición inicial del webhook
 */
var verifyWebhook = (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === WEBHOOK_TOKEN) {
    console.log("Webhook validado exitosamente");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("No fue posible validar el webhook. Asegurate de que el token coincida");
    res.sendStatus(403);
  }
}

var webhookMessaging = (req, res) => {
  let body = req.body;

  //Válida que sea una petición desde la página
  if (body.object == 'page') {
    let pageID = body.entry[0].id;
    let timeOfEvent = new Date(body.entry[0].time);
    let senderId = body.entry[0].messaging[0].sender.id;
    let messageEvent = body.entry[0].messaging[0];
    let webhookEvent;

    if (messageEvent.message) {
      webhookEvent = '\"message\"';
      EVENTS.messagePostbacks(senderId, messageEvent);
    } else if (messageEvent.postback) {
      webhookEvent = '\"postback\"';
      EVENTS.messagePostbacks(senderId, messageEvent);
    } else if (messageEvent.delivery) {
      webhookEvent = '\"delivery\"';

    } else if (messageEvent.optin) {
      webhookEvent = '\"optin\"';

    } else if (messageEvent.read) {
      webhookEvent = '\"read\"';

    } else if (messageEvent.account_linking) {
      webhookEvent = '\"account_linking\"';

    } else {
      webhookEvent = '\"desconicido\"';

    }
    console.log('<<<<====%s Evento webhook %s recibido====>>>>', moment(timeOfEvent).format("YYYY-MM-DD HH:mm:ss"), webhookEvent);
    console.log(messageEvent);
    console.log('---------------------------------------------------------------------');

    //API.getFacebookDataUser(senderId).then(dataUser => {}).catch(error => {})

    //Devolver '200 (process ok)' a todos los eventos.
    res.sendStatus(200);
  } else {
    //Devolver '404 (Not Found)' si el evento no es de una suscripción a la página
    res.sendStatus(404);
  }
}

//exportar funciones
module.exports = ({
  verifyWebhook,
  webhookMessaging
});
