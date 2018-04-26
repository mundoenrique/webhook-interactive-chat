'use strict'
const
//dependencias
API = require('./connectAPIS'),
HELP = require('./modules/helpers'),
TYC = require('./modules/tyc'),
OPER = require('./modules/operations'),
QUEST = require('./modules/questions'),
BAL = require('./modules/balance'),
MOV = require('./modules/movements');
var
messageData = HELP.messageData,
//Manejo de eventos para el API de python
messagePostbacks = (senderId, messageEvent) => {
  let message;
  //Verifica si el evento es un MESSAGE o un POSTBACK
  if(messageEvent.message) {
    if(messageEvent.message.attachments) {
      message = messageEvent.message.attachments;
    } else if(messageEvent.message.quick_reply) {
      message = messageEvent.message.quick_reply.payload;
    } else if (messageEvent.message.text) {
      message = messageEvent.message.text.toLowerCase();
    }
  } else if(messageEvent.postback) {
    message = messageEvent.postback.payload;
  }
  //Evalua el mensaje recibido
  switch (message) {
    case 'leer':
      TYC.sendFile(senderId)
      .catch((error) => console.log(error))
      break;
    case 'preguntas':
      QUEST.otherConsultaions(senderId);
      break;
    case 'viewMore':
      MOV.getMovementsRedis(senderId);
      break;
    default:
      let
      action = 'dataUser',
      method = 'GET',
      uri = '',
      body = {recipient: {id: senderId}},
      dataUser;
      //inicia secuencia de promesas
      API.facebookRequest(action, method, uri, body)
      .then(facebookResponse => {
        dataUser = facebookResponse;
        return message === 'acepto' ? TYC.sendFile(senderId) : true;
      })
      .then(TyCresponse => {
        return API.pythonRequest(senderId, dataUser, message);
      })
      .then(pythonResponse => {
        let
        statusCode = pythonResponse.statusCode,
        responsePython = pythonResponse.body;
        //Evalua si el código de la respuesta es 200
        if(statusCode !== 200) {
          responsePython = {
            sender: {tyc: 1},
            text: 'Lo siento en este momento no puedo atender tu solicitud, por favor intenta en unos minutos'
          };
        }
        handleResponsePython(senderId, responsePython);
      })
      .catch(error => console.log(error));
  }
},
//Maneja la respuesta del API de python
handleResponsePython = (senderId, responsePython) => {
  let
  action = 'typingOff',
  body = {
    messaging_type: 'RESPONSE',
    recipient: {
      id : senderId
    },
    sender_action: 'typing_off'
  };
  API.facebookRequest(action, HELP.method, HELP.uri, body)
  .then(() => {

    if(responsePython.sender.tyc === 0) {
      TYC.requestAccept(senderId, responsePython);
    } else if(responsePython.operations) {
      OPER.sendOperations(senderId, responsePython);
    } else if(responsePython.notification) {
      OPER.tokenShippingOptions(senderId, responsePython);
    } else if(responsePython.website) {
      OPER.withoutProducts(senderId, responsePython);
    } else if(responsePython.cardlist) {
      BAL.sendBalance(senderId, responsePython);
    } else if(responsePython.cardmovements) {
      if(responsePython.cardmovements === '') {
        responsePython.text = '';
      }
      MOV.SetMovementsRedis(senderId, responsePython);
    } else {
      sendSimpleMessage(senderId, responsePython);
    }
  })
  .catch(error => console.log(error));
},
//Enviar mensaje simple
sendSimpleMessage = (senderId, responseApi) => {
  let action = 'simpleMessage';

  messageData.recipient.id = senderId;
  messageData.message = {
    text: responseApi.text
  };

  API.facebookRequest(action, HELP.method, HELP.uri, messageData)
  .then()
  .catch(error => console.log(error));
};

module.exports = ({
  messagePostbacks
});
