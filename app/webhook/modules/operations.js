'use strict'
const
//Dependencias
config = require('config'),
API = require('../connectAPIS'),
HELP = require('./helpers'),
//URL del servidor
SERVER_URL = process.env.SERVER_URL ? process.env.SERVER_URL : config.get('serverUrl');

var
messageData = HELP.messageData,
//Operaciones disponobles
sendOperations = (senderId, responsePython) => {
  let elementsTemplate = [];
  HELP.action = 'operations';

  responsePython.operations.forEach(operation => {
    let
    element = {},
    payloadPost = operation === 'Otras Consultas' ? 'preguntas' : operation;

    element['title'] = 'Aquí puedes ver';
    element['image_url'] = SERVER_URL + '/img/' + payloadPost.toLowerCase() + '.png';
    element['buttons'] = [{
      type: 'postback',
      title: operation,
      payload: payloadPost
    }];

    elementsTemplate.push(element);
  });

  messageData.recipient.id = senderId;
  messageData.message = {
    text: responsePython.text
  };

  API.facebookRequest(HELP.action, HELP.method, HELP.uri, messageData)
  .then(() => {
    messageData.recipient.id = senderId;
    messageData.message = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          sharable: false,
          elements: elementsTemplate
        }
      }
    }
    return API.facebookRequest(HELP.action, HELP.method, HELP.uri, messageData)
  })
  .then()
  .catch(error => console.log(error))
},
//Opciones de envío del Token
tokenShippingOptions = (senderId, responsePython) => {
  let
  notification = responsePython.notification,
  quickReplies = [];
  HELP.action = 'options';

  for (var key in notification) {
    let element = {}
    element['content_type'] = 'text';
    element['title'] = key === 'email' ? '📧 ' + notification.email : '📱 ' + notification.SMS;
    element['payload'] = key === 'email' ? notification.email : notification.SMS;
    quickReplies.push(element);
  }
  messageData.recipient.id = senderId;
  messageData.message = {
    text: responsePython.text,
    quick_replies: quickReplies
  }

  API.facebookRequest(HELP.action, HELP.method, HELP.uri, messageData)
  .then()
  .catch(error => console.log(error));
},
//usuario sin productos
withoutProducts = (senderId, responsePython) => {
  HELP.action = 'withoutProducts';
  messageData.recipient.id = senderId;
  messageData.message = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [{
          title: responsePython.text,
          buttons: [{
            title: 'Presiona aquí',
            type: 'web_url',
            url: responsePython.website
          }]
        }]
      }
    }
  }
  API.facebookRequest(HELP.action, HELP.method, HELP.uri, messageData)
  .then()
  .catch(error => console.log(error));
}

module.exports = ({
  sendOperations,
  tokenShippingOptions,
  withoutProducts
});
