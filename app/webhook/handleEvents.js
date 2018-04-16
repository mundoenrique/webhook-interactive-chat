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
    case 'downloadConditions':
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
    .then(responsePython => {
      return handleResponsePython(senderId, responsePython);
    })
    .catch(error => {
      console.log(error);
      if(error.action) {
        let message = 'lo siento en este momento no puedo atender tu solicitud, por favor intente en unos minutos';
        handleResponsePython = (senderId, message);
      }
    });
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
    if(responsePython.sender.tyc) {
      TYC.requestAccept(senderId, responsePython);
    } else {
      sendSimpleMessage(senderId, responsePython);
    }
  })
  .catch(error => console.log(error))
},
//Enviar mensaje simple
sendSimpleMessage = (senderId, responseApi) => {
  let
  message = responseApi.text ? responseApi.text : responseApi,
  action = 'simpleMessage',
  method = 'POST',
  uri = 'me/messages',
  body = {
    messaging_type: 'RESPONSE',
    recipient: {
      id : senderId
    },
    message: {
      text: message
    }
  };
  API.facebookRequest(action, method, uri, body)
  .then()
  .catch(error => console.log(error))
};

module.exports = ({
  messagePostbacks
})
