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
setOperations = (senderId, responsePython) => {
  let
  action = 'operations',
  elementsTemplate = [];

  responsePython.operations.forEach(operation => {
    let
    element = {},
    payloadPost = operation === 'Otras Preguntas' ? 'preguntas' : operation;

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

  API.facebookRequest(action, HELP.method, HELP.uri, messageData)
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
    return API.facebookRequest(action, HELP.method, HELP.uri, messageData)
  })
  .then()
  .catch(error => console.log(error))

}

module.exports = ({
  setOperations
});
