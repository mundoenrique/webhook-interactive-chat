'use strict'
const
//Dependencias
config = require('config'),
API = require('./connectAPIS'),
EVENTS = require('./handleEvents'),
//Token de validación del webhook
WEBHOOK_TOKEN = (process.env.WEBHOOK_TOKEN) ? process.env.WEBHOOK_TOKEN : config.get('webHookToken');
//Valida webhook
var
//Hora actual
currentTime = require('./modules/helpers').currentTime,
verifyWebhook = (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === WEBHOOK_TOKEN) {
    console.log("Webhook validado exitosamente");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("No fue posible validar el webhook. Asegurate de que el token coincida");
    res.sendStatus(403);
  }
},
//Recibe eventos webhook
webhookMessaging = (req, res) => {
  let bodyReq = req.body;
  //Válida que sea una petición desde la página
  if (bodyReq.object == 'page') {
    let
    action = 'typingOn',
    method = 'POST',
    uri = 'me/messages';
    // body = {
    //   messaging_type: "RESPONSE",
    //   recipient: {
    //       id: senderId
    //   },
    //   sender_action: "typing_on"
    // };

    bodyReq.entry.forEach((bodyEntry) =>{
      let
      event = '',
      pageId = bodyEntry.id,
      timeEvent = bodyEntry.time;

      bodyEntry.messaging.forEach((messageEvent) => {
        let senderId = messageEvent.sender.id;
        if(messageEvent.message) {
          event = 'message';

        } else if(messageEvent.postback) {
          event = 'postback';

        } else if(messageEvent.delivery) {
          event = 'delivery';

        } else if(messageEvent.optin) {
          event = 'optin';

        } else if(messageEvent.read) {
          event = 'read';

        } else if(messageEvent.account_linking) {
          event = 'account_linking';

        }
        //Devolver '200 (process ok)' a todos los eventos.
        res.sendStatus(200);
        console.log(`-----%s Evento webhook ${event} recibido: senderId %s-----`, currentTime, senderId);
        console.log(messageEvent);
        console.log('------------------------------------------------------------------------');
        switch (event) {
          case 'message':
          case 'postback':
            EVENTS.messagePostbacks(senderId, messageEvent);
            break;
          case 'delivery':
          case 'optin':
          case 'read':
          case 'account_linking':
            break;
          default:
            console.error('No fue posible identificar el evento webhook recibido')

        }
      });
    });

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
