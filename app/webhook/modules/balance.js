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
  cardList = [];
  HELP.action = 'balance';
  if(responsePython.cardlist[0]) {
    cardList = responsePython.cardlist;
  } else {
    cardList.push(responsePython.cardlist)
  }
  console.log(typeof(cardList));
  console.log(cardList);

}

module.exports = ({
  sendBalance
});
