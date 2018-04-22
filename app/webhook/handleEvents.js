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
        return true//API.pythonRequest(senderId, dataUser, message);
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
        responsePython = {
          cardmovements: [{
                                 amount: '78.0',
                                 category: '5411',
                                 code: '40',
                                 currency: '604',
                                 date: '2018-03-30 01:55:00.0',
                                 description: 'PLAZA VEA LA CURVA     LIMA           PE',
                                 rc: '0',
                                 reference: '808901942442',
                                 sign: '-'
                      },
                      {
                                 amount: '18.8',
                                 category: '5411',
                                 code: '40',
                                 currency: '604',
                                 date: '2018-03-28 00:02:38.0',
                                 description: 'GRIFOS ESPINOZA MARKET LIMA           PE',
                                 rc: '0',
                                 reference: '808700396959',
                                 sign: '-'
                      },
                      {
                                 amount: '95.24',
                                 category: '9999',
                                 code: '20',
                                 currency: '604',
                                  date: '2018-03-23 16:00:21.0',
                                 description: 'PROVIS ALIMENTACION VISA                ',
                                 rc: '0',
                                 reference: '442887',
                                 sign: '+'
                      },
                      {
                                 amount: '9.9',
                                 category: '5812',
                                 code: '40',
                                 currency: '604',
                                 date: '2018-02-28 00:25:03.0',
                                 description: 'BEMBOS BURGER GRILL    LIMA           PE',
                                 rc: '0',
                                 reference: '805900445247',
                                 sign: '-'
                      },
                      {
                                 amount: '56.75',
                                 category: '5411',
                                 code: '40',
                                 currency: '604',
                                 date: '2018-02-28 00:16:13.0',
                                 description: 'PLAZA VEA GCIVIL LINEALLIMA           PE',
                                 rc: '0',
                                 reference: '805900430693',
                                 sign: '-'
                      },
                      {
                                 amount: '31.13',
                                 category: '5499',
                                 code: '40',
                                 currency: '604',
                                 date: '2018-02-25 23:11:55.0',
                                 description: 'LA SANAHORIA BARRANCO  LIMA           PE',
                                 rc: '0',
                                 reference: '805623233675',
                                 sign: '-'
                      },
                      {
                                 amount: '95.24',
                                 category: '9999',
                                 code: '20',
                                 currency: '604',
                                 date: '2018-02-22 15:47:34.0',
                                 description: 'PROVIS ALIMENTACION VISA                ',
                                 rc: '0',
                                 reference: '399992',
                                 sign: '+'
                      },
                      {
                                 amount: '20.0',
                                 category: '5812',
                                 code: '40',
                                 currency: '604',
                                 date: '2018-02-08 18:30:27.0',
                                 description: 'RESTAURANT TAMBO REAL  LIMA           PE',
                                 rc: '0',
                                 reference: '803918051383',
                                 sign: '-'
                      },
                      {
                                 amount: '10.0',
                                 category: '5812',
                                 code: '40',
                                 currency: '604',
                                 date: '2018-02-07 18:23:45.0',
                                 description: 'CHIFA SAGITARIO        LIMA           PE',
                                 rc: '0',
                                 reference: '803818419342',
                                 sign: '-'
                      },
                      {
                                 amount: '12.9',
                                 category: '5814',
                                 code: '40',
                                 currency: '604',
                                 date: '2018-02-06 00:40:34.0',
                                 description: 'CANELIE                LIMA           PE',
                                 rc: '0',
                                 reference: '803700194501',
                                 sign: '-'
                      },
                      {
                                 amount: '92.81',
                                 category: '5411',
                                 code: '40',
                                 currency: '604',
                                 date: '2018-02-06 00:33:51.0',
                                 description: 'PLAZA VEA LA CURVA     LIMA           PE',
                                 rc: '0',
                                 reference: '803700183484',
                                 sign: '-'
                      },
                      {
                                 amount: '95.24',
                                 category: '9999',
                                 code: '20',
                                 currency: '604',
                                 date: '2018-01-23 15:48:40.0',
                                 description: 'PROVIS ALIMENTACION VISA                ',
                                 rc: '0',
                                 reference: '359084',
                                 sign: '+'
                      },
                      {
                                 amount: '9.99',
                                 category: '5411',
                                 code: '40',
                                 currency: '604',
                                 date: '2017-12-24 22:42:08.0',
                                 description: 'PLAZA VEA LA CURVA     LIMA           PE',
                                 rc: '0',
                                 reference: '735822058230',
                                 sign: '-'
                      },
                      {
                                 amount: '17.5',
                                 category: '5411',
                                 code: '40',
                                 currency: '604',
                                 date: '2017-12-24 22:41:08.0',
                                 description: 'PLAZA VEA LA CURVA     LIMA           PE',
                                 rc: '0',
                                 reference: '735822056995',
                                 sign: '-'
                      },
                      {
                                 amount: '26.8',
                                 category: '5812',
                                 code: '40',
                                 currency: '604',
                                 date: '2017-12-23 02:15:53.0',
                                 description: 'RUSTICA                LIMA           PE',
                                 rc: '0',
                                 reference: '735702218759',
                                 sign: '-'
                      },
                      {
                                  amount: '95.24',
                                 category: '9999',
                                 code: '20',
                                 currency: '604',
                                 date: '2017-12-20 18:32:16.0',
                                 description: 'PROVIS ALIMENTACION VISA                ',
                                 rc: '0',
                                 reference: '320352',
                                 sign: '+'
                      },
                      {
                                 amount: '91.33',
                                 category: '5411',
                                 code: '40',
                                 currency: '604',
                                 date: '2017-11-28 00:40:21.0',
                                 description: 'PLAZA VEA GCIVIL LINEALLIMA           PE',
                                 rc: '0',
                                 reference: '733200194173',
                                 sign: '-'
                      },
                      {
                                 amount: '95.24',
                                 category: '9999',
                                  code: '20',
                                 currency: '604',
                                 date: '2017-11-24 18:51:28.0',
                                 description: 'PROVIS ALIMENTACION VISA                ',
                                 rc: '0',
                                 reference: '283340',
                                 sign: '+'
                      },
                      {
                                 amount: '70.0',
                                 category: '5411',
                                 code: '40',
                                 currency: '604',
                                 date: '2017-11-01 22:41:13.0',
                                 description: 'TOTTUS PACHACUTEC      LIMA           PE',
                                 rc: '0',
                                 reference: '730522064754',
                                 sign: '-'
                      },
                      {
                                 amount: '25.5',
                                 category: '5812',
                                 code: '40',
                                 currency: '604',
                                 date: '2017-10-26 18:24:42.0',
                                 description: 'CHIFA SAGITARIO DELIVERLIMA           PE',
                                 rc: '0',
                                 reference: '729918440453',
                                 sign: '-'
                      }
          ],
          'message-type': ['movements', 'movimientos'],
          sender: {
                      _id: '',
                      'external-id': '1651810638267345',
                      'facebook-data': {
                                 first_name: 'Judith',
                                 gender: 'female',
                                 id: '1651810638267345',
                                 last_name: 'Huaman',
                                 locale: 'es_LA',
                                 profile_pic: 'https://lookaside.facebook.com/platform/profilepic/?psid=1651810638267345&width=1024&ext=1523822820&hash=AeRHFvYfoy0yU74J',
                                 timezone: -5
                      },
                      'first-name': 'Judith',
                      'last-name': 'Huaman',
                      status: 'A',
                      tyc: 1
          },
          text: 'a continuación tus movimientos... ',
          trxDate: '2018-04-12 20:07:02.389'
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
