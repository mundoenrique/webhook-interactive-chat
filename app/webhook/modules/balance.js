'use strict'
const
//Dependencias
config = require('config'),
API = require('../connectAPIS'),
HELP = require('./helpers'),
//URL del Servidor
SERVER_URL = process.env.SERVER_URL ? process.env.SERVER_URL : config.get('serverUrl');
var
messageData = HELP.messageData,
//Enviar saldo al usuario
sendBalance = (senderId, responsePython) => {
  let
  elementsTemplate = [],
  cardList = HELP.objectTrasform(responsePython.cardlist);
  HELP.action = 'balance';

  cardList.forEach(card => {
    let element = {};
    element['title'] = 'Saldo disponible: S/' + parseFloat(card.balance).toFixed(2);
    element['subtitle'] = 'Tarjeta: ' + card.maskedCard;
    element['image_url'] = SERVER_URL + 'img/tarjeta_Provis.png';
    element['buttons'] = [{
      type: 'postback',
      title: 'Movimientos',
      payload: 'movimientos ' + card.maskedCard
    }];
    elementsTemplate.push(element)
  });

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
  API.facebookRequest(HELP.action, HELP.method, HELP.uri, messageData)
  .then()
  .catch(error => console.log(error));
}

module.exports = ({
  sendBalance
});
