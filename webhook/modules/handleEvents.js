'use strict'
//dependencias

//Manejo de eventos para el API de python
var messagePostbacks = (senderId, messageEvent) => {
  let message;

  if(messageEvent.message) {
    let messageText = messageEvent.message.text;
    let messageAttachments = messageEvent.message.attachments;
    let quickReply = messageEvent.message.quick_reply;

    if(messageText) {
      message = messageText;
    } else if(messageAttachments) {
      message = messageAttachments;
    } else if (quickReply) {
      message = quickReply;
    }
  } else if(messageEvent.postback) {
    message = messageEvent.postback.payload;
  }



 console.log('<<<<====mensaje recibido====>>>>');
 console.log(message);
 console.log('--------------------------------');




  /*
  return new Promise((resolve, reject) => {

  });
  */
}

module.exports = ({
  messagePostbacks
})
