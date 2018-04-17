'use strict'
const
//Dependencias
config = require('config'),
API = require('../connectAPIS'),
HELP = require('./helpers'),
//URL del Servidor
SERVER_URL = process.env.SERVER_URL ? process.env.SERVER_URL : config.get('serverUrl');
var
action = 'questions',
messageData = HELP.messageData,
//Preguntas disponibles
otherConsultaions = (senderId) => {
  messageData.recipient.id = senderId;
  messageData.message = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [{
          title: 'Puedo ayudarte con las siguientes operaciones',
          buttons: [
            {
              title: 'Realizar reclamos',
              type: 'postback',
              payload: 'Realizar reclamos'
            },
            {
              title: 'Cambio de Clave',
              type: 'postback',
              payload: 'Cambio de clave'
            },
            {
              title: 'Reposición de Tarjeta',
              type: 'postback',
              payload: 'Reposición de tarjeta'
            }
          ]
        }]
      }
    }
  };
  API.facebookRequest(action, HELP.method, HELP.uri, messageData)
  .then(() => {
    messageData.message = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          sharable: false,
          text: 'y estas otras',
          buttons: [
            {
              title: 'Bloqueo de Tarjeta',
              type: 'postback',
              payload: 'Bloqueo de tarjeta'
            },
            {
              title: 'Donde Usar tus Tarjetas',
              type: 'postback',
              payload: 'Donde usar tus tarjetas'
            }
          ]
        }
      }
    }
    return API.facebookRequest(action, HELP.method, HELP.uri, messageData)
  })
  .then()
  .catch(error => console.log(error))

}

module.exports = ({
  otherConsultaions
});
