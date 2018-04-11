'use strict'
const
  //dependencias
  API = require('./connectAPIS'),
  TYC = require('./modules/tyc')
;
//Manejo de eventos para el API de python
var messagePostbacks = (senderId, messageEvent) => {
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
      body = {recipient: {id: senderId}}
    ;
    API.facebookRequest(action, method, uri, body)
      .then(dataUser => {
        return API.pythonRequest(senderId, dataUser, message);
      })
      .then(responsePython => {
        handleResponsePython(senderId, responsePython);
      })
      .catch()
    ;
  }
}

//Maneja la respuesta del API de python
var handleResponsePython = (senderId, responsePython) => {
  if(responsePython.sender.tyc === 1) {
    TYC.requestAccept(senderId, responsePython);
  }
}

module.exports = ({
  messagePostbacks
})
