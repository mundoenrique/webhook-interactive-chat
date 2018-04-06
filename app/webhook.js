'use strict'
//Token de validación del webhook
const
  config = require('config'),
  API = require('./modules/consumeAPI'),
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
    console.log(body.entry[0]);
    console.log(body.entry[0].messaging);
    // Recorrer cada entrada
    body.entry.forEach((bodyEntry) => {
      let pageID = bodyEntry.id;
      let timeOfEvent = bodyEntry.time;
      let webhookEvent;
      //Recorrer cada evento del mensaje (Iterate over each messaging event)
      bodyEntry.messaging.forEach((messagingEvent) => {
        let senderId = messagingEvent.sender.id;
        API.getFacebookDataUser(senderId);
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
      console.log('%s Evento webhook recibido %s', new Date(timeOfEvent).toISOString().replace(/T/, ' ').replace(/\..+/, ''), webhookEvent);
    });
    //Es necesario responder (200) para indicarle a facebbok que se recibio la solicitud correctamente.
    res.sendStatus(200);
  }
}

//exportar funciones
module.exports = ({
  verifyWebhook,
  webhookMessaging
});
