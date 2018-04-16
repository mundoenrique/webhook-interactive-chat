'use strict'
const
//dependencias
API = require('./connectAPIS'),
TYC = require('./modules/tyc');
var
//Manejo de eventos para el API de python
messagePostbacks = (senderId, messageEvent) => {
  let message;
  //Verifica si el evento es un MESSAGE o un POSTBACK
  if(messageEvent.message) {
    if(messageEvent.message.text) {
      message = messageEvent.message.text.toLowerCase();
    } else if(messageEvent.message.attachments) {
      message = messageEvent.message.attachments;
    } else if (messageEvent.message.quick_reply) {
      message = messageEvent.message.quick_reply;
    }
  } else if(messageEvent.postback) {
    message = messageEvent.postback.payload;
  }
  switch (message) {
    case 'leer':
      TYC.sendFile(senderId);
      break;
    case 'preguntas':
    case 'acepto':
    case 'viewMore':
    default:
      let
      action = 'dataUser',
      method = 'GET',
      uri = '',
      body = {
        recipient: {
          id: senderId
        }
      };
      API.facebookRequest(action, method, uri, body)
      .then(dataUser => {
        return API.pythonRequest(senderId, dataUser, message);
      })
      .then(response => {
        let
        statusCode = response.statusCode,
        responsePython = response.body;
        if(statusCode !== 200) {
          responsePython = {
            sender: {tyc: 1},
            text: 'Lo siento en este momento no puedo atender tu solicitud, por favor intenta en unos minutos'
          };
        }
        return handleResponsePython(senderId, responsePython);
      })
      .catch(error => console.log(error));
  }
},
//Maneja la respuesta del API de python
handleResponsePython = (senderId, responsePython) => {
  let
  action = 'typingOff',
  method = 'POST',
  uri = 'me/messages',
  body = {
    messaging_type: 'RESPONSE',
    recipient: {
      id : senderId
    },
    sender_action: 'typing_off'
  };
  API.facebookRequest(action, method, uri, body)
  .then(() => {
    if(responsePython.sender.tyc === 0) {
      TYC.requestAccept(senderId, responsePython);
    } else {
      sendSimpleMessage(senderId, responsePython);
    }
  })
  .catch(error => console.log(error));
},
//Enviar mensaje simple
sendSimpleMessage = (senderId, responseApi) => {
  let
  action = 'simpleMessage',
  method = 'POST',
  uri = 'me/messages',
  body = {
    messaging_type: 'RESPONSE',
    recipient: {
      id : senderId
    },
    message: {
      text: responseApi.text
    }
  };
  API.facebookRequest(action, method, uri, body)
  .then()
  .catch(error => console.log(error))
};

module.exports = ({
  messagePostbacks
});
