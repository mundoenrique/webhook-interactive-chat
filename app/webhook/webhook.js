'use strict'
const
  //Dependencias
  config = require('config'),
  moment = require('moment'),
  api = require('./connectAPIS'),
  events = require('./handleEvents'),
  //Token de validación del webhook
  WEBHOOK_TOKEN = (process.env.WEBHOOK_TOKEN) ? process.env.WEBHOOK_TOKEN : config.get('webHookToken')
;
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
  let bodyReq = req.body;

  //Válida que sea una petición desde la página
  if (bodyReq.object == 'page') {
    let
      pageId = bodyReq.entry[0].id,
      timeOfEvent = new Date(bodyReq.entry[0].time),
      messageEvent = bodyReq.entry[0].messaging[0],
      senderId = bodyReq.entry[0].messaging[0].sender.id,
      action = 'typingOn',
      method = 'POST',
      uri = 'me/messages',
      body = {
        messaging_type: "RESPONSE",
        recipient: {
            id: senderId
        },
        sender_action: "typing_on"
      };

    console.log('-----%s Evento webhook recibido: senderId %s-----', moment(timeOfEvent).format("YYYY-MM-DD HH:mm:ss"), senderId);
    console.log(messageEvent);
    console.log('---------------------------------------------------------------------');

    api.facebookRequest(action, method, uri, body)
      .then(() => {
        if (messageEvent.message || messageEvent.postback) {
          events.messagePostbacks(senderId, messageEvent);

        } else if (messageEvent.delivery) {

        } else if (messageEvent.optin) {


        } else if (messageEvent.read) {

        } else if (messageEvent.account_linking) {

        } else {
          console.log('No fue posible identificar el evnto webhook recibido')
        }
      })
      .catch(error => console.log(error));

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
