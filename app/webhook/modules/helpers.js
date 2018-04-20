'use strict'
const monment = require('moment');
var
//Hora actual
currentTime = monment().format('YYYY-MM-DD HH:mm:ss'),
//Acción a realizar
action,
//Método de envío de los mensajes al usuario
method = 'POST',
//uri de los mensajes al usuario
uri = 'me/messages',
//cuerpo de los mensajes para al usuario
messageData = {
  messaging_type: 'RESPONSE',
  recipient: {
    id: ''
  },
  message: ''
},
objectTrasform = (element) => {
  let elementList = []

  if(element[0]) {
    elementList = element
  } else {
    elementList.push(element)
  }

  return elementList;
}

module.exports = ({
  currentTime,
  action,
  method,
  uri,
  messageData,
  objectTrasform
});
