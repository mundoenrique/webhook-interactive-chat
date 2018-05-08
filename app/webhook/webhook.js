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
    let event, pageId, senderId, timeEvent, messageEvent;

    bodyReq.entry.forEach((bodyEntry) => {
      event = 'evento desconocido';
      pageId = bodyEntry.id;
      timeEvent = bodyEntry.time;

      bodyEntry.messaging.forEach((messagingEvent) => {
        senderId = messagingEvent.sender.id;
        if(messagingEvent.message) {
          event = 'message';
          messageEvent = messagingEvent.message;

        } else if(messagingEvent.postback) {
          event = 'postback';
          messageEvent = messagingEvent.postback;

        } else if(messagingEvent.delivery) {
          event = 'delivery';
          messageEvent = messagingEvent.delivery;

        } else if(messagingEvent.optin) {
          event = 'optin';
          messageEvent = messagingEvent.optin;

        } else if(messagingEvent.read) {
          event = 'read';
          messageEvent = messagingEvent.read;

        } else if(messagingEvent.account_linking) {
          event = 'account_linking';
          messageEvent = messagingEvent.account_linking;

        }
      });
    });
    console.log(`-----${currentTime} Evento webhook ${event} recibido: senderId ${senderId}-----`);
    console.log(messageEvent);
    console.log('------------------------------------------------------------------------');
    let
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
    API.facebookRequest(action, method, uri, body)
    .then(() =>{
      switch (event) {
        case 'message':
        case 'postback':
          //EVENTS.messagePostbacks(senderId, messageEvent);
          break;
        case 'delivery':
        case 'optin':
        case 'read':
        case 'account_linking':
          break;
        default:
          console.error('No fue posible identificar el evento webhook recibido');
      }
    })
    .catch(error => console.log(error))
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
