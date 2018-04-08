'use strict'
//Token de validación del webhook
const
  config = require('config'),
  moment = require('moment'),
  API = require('./connectAPIS'),
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

  //Validar que se un petición desde la página
  if (body.object == 'page') {
    console.log(body.entry[0].messaging[0]);
    let pageID = body.entry[0].id;
    let timeOfEvent = new Date(body.entry[0].time);
    let senderId = body.entry[0].messaging[0].sender.id;
    let messagingEvent = body.entry[0].messaging[0];
    let webhookEvent;
    API.getFacebookDataUser(senderId, function(userData){
      console.log(userData)
      if (messagingEvent.optin) {
          webhookEvent = 'optin';
          //receivedAuthentication(messagingEvent);
        } else if (messagingEvent.message) {
          webhookEvent = '\"message\"';
          //receivedMessage(messagingEvent);
        } else if (messagingEvent.delivery) {
          webhookEvent = '\"delivery\"';
          //receivedDeliveryConfirmation(messagingEvent);
        } else if (messagingEvent.postback) {
          webhookEvent = '\"postback\"';
          //receivedPostback(messagingEvent);
        } else if (messagingEvent.read) {
          webhookEvent = '\"read';
          //receivedMessageRead(messagingEvent\");
        } else if (messagingEvent.account_linking) {
          webhookEvent = '\"account_linking\"';
          //receivedAccountLink(messagingEvent);
        } else {
          console.log("Se recibio un evento desconocido", messagingEvent);
        }
    });
    console.log('-------------------------------------------------------');
    console.log('%s Evento webhook recibido %s', moment(timeOfEvent).format("YYYY-MM-DD HH:mm:ss"), webhookEvent);
    //Es necesario responder (200) para indicarle a facebbok que se recibio la solicitud correctamente.
    res.sendStatus(200);
  }
}

//exportar funciones
module.exports = ({
  verifyWebhook,
  webhookMessaging
});
