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
  cardList = responsePython.cardList;
  HELP.action = 'balance';
  console.log(typeof(cardList));
  if(typeof(cardList) !== 'array') {

  }

}

module.exports = ({
  sendBalance
});
