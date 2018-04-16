'use strict'
var
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
};

module.exports = ({
  method,
  uri,
  messageData
});
