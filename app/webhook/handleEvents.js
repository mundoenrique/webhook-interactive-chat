'use strict'
//dependencias
const
  API = require('./connectAPIS')
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
     case 'downloadConditions':
     case 'preguntas':
     case 'acepto':
     case 'viewMore':
     default:
      console.log(message);
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

        })
        .catch(error => console.log(error));

   }


}

module.exports = ({
  messagePostbacks
})
