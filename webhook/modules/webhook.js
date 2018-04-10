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
    let
      pageID = body.entry[0].id,
      timeOfEvent = new Date(body.entry[0].time),
      senderId = body.entry[0].messaging[0].sender.id,
      messageEvent = body.entry[0].messaging[0],
      action = 'markSeen',
      method = 'POST',
      header = '',
      uri = 'me/messages',
      sender_Id = '',
      bodyRes = {
      messaging_type: "RESPONSE",
      recipient: {
          id: senderId
      },
      sender_action: "mark_seen"
    };

    console.log('--------%s Evento webhook recibido--------', moment().format("YYYY-MM-DD HH:mm:ss"));
    console.log(messageEvent);
    console.log('---------------------------------------------------------------------');

    API.facebookRequest(action, method, header, uri, sender_Id, bodyRes)
      .then(body => {
        if (messageEvent.message || messageEvent.postback) {
          EVENTS.messagePostbacks(senderId, messageEvent);

        } else if (messageEvent.delivery) {

        } else if (messageEvent.optin) {


        } else if (messageEvent.read) {

        } else if (messageEvent.account_linking) {

        } else {
          console.log('No fue posible identificar el evnto webhook recibido')
        }

        /*
        API.facebookRequest('dataUser', 'GET', '', '', senderId, '')
          .then(body => {})
          .catch(error => console.log('Erorr====>>>>', error));
        */
        //API.getFacebookDataUser(senderId).then(dataUser => {}).catch(error => {})
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
