'use strcit'
const
//Dependencias
config = require('config'),
express = require('express'),
API = require('../connectAPIS'),
//URL del servidor
SERVER_URL = process.env.SERVER_URL ? process.env.SERVER_URL : config.get('serverUrl');
var
action = 'tyc',
method = 'POST',
uri = 'me/messages',
body = {
  messaging_type: 'RESPONSE',
  recipient: {
    id: ''
  },
  message: ''
},
//Solicita la aceptación de los términos y condiciones
requestAccept = (senderId, resposeApi) => {
  let message = 'Hola soy Mia, el asistente Virtual de Tebca. Te ayudaré a realizar las consultas que necesites sobre tus tarjetas'; //resposeApi.text;

  body.recipient.id = senderId;
  body.message = {
    text: message
  };

  API.facebookRequest(action, method, uri, body)
  .then(() => {
    body.recipient.id = senderId;
    body.message = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          sharable: false,
          elements: [{
            title: 'MIA',
            subtitle: 'Para poder interactuar conmigo por favor acepta los Términos y Condiciones',
            image_url: SERVER_URL + '/img/mia_tyc.png',
            buttons:
            [
              {
                type: 'postback',
                title: 'Aceptar',
                payload: 'acepto'
              },
              {
                type: 'postback',
                title: 'Leer',
                payload: 'leer'
              }
            ]
          }]
        }
      }
    };
    return API.facebookRequest(action, method, uri, body)
  })
  .then()
  .catch(error => console.log(error));
},
//Enviar adjunto los términos y condiciones
sendFile = (senderId, message) => {
  body.recipient.id = senderId;
  body.message = {
    attachment: {
      type: 'file',
      payload: {
        url: SERVER_URL + 'download/Terminos_y_Condiciones.pdf'
      }

    }
  }

  API.facebookRequest(action, method, uri, body)
  .then()
  .catch(error => console.log(error));
};

module.exports = ({
  sendFile,
  requestAccept
})
