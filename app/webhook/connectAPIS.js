'use strict'
const
//Dependencias
config = require('config'),
request = require('request'),
//Token generado por el portal de facebook developers
MSN_ACCESS_TOKEN = process.env.MSN_ACCESS_TOKEN ? process.env.MSN_ACCESS_TOKEN : config.get('msnAccessToken'),
//API ´de facebook
FACEBOOK_API = process.env.FACEBOOK_API ? process.env.FACEBOOK_API : config.get('faceBookAPI'),
//API de Python
PYTHON_API = process.env.PYTHON_API ? process.env.PYTHON_API : config.get('pythonAPI');

var
//Hora actual
currentTime = require('./modules/helpers').currentTime,
//Request al API de facebook
facebookRequest = (action, method, uri, body) => {
  let
  msg,
  senderId = body.recipient ? body.recipient.id : '',
  userId = '';
  //Evalua la acción que va a realizar la función
  switch (action) {
    case 'persistent_menu':
      msg = 'Activar botón \"Empezar\", saludo y menú persistente';
      break;
    case 'dataUser':
      msg = 'Datos públicos del usuario: senderId ';
      userId = senderId;
      break;
    default:
      msg = 'mensaje al usuario: senderId ';

  }
  return new Promise((resolve, reject) => {
    console.log('-------- %s \"%s\" REQUEST facebook %s %s--------', currentTime, action, msg, senderId);
    console.log(body);
    console.log('--------------------------------------------------');
    //Envia solicitud al API de facebook
    request({
      method: method,
      headers: {"content-type": "application/json"},
      url: FACEBOOK_API + uri + userId,
      qs: {access_token: MSN_ACCESS_TOKEN},
      json: body,
    }, (error, response, body) => {
      let fail = error ? error : '';
      console.log('--------%s \"%s\" RESPONSE facebook %s %s--------', currentTime, action, msg, senderId);
      console.log('statusCode:', response.statusCode);
      console.log('statusMessage:', response.statusMessage);
      console.log(body, fail);
      console.log('---------------------------------------------------');
      error || response.statusCode !== 200 ? reject(new Error(action)) : resolve(body);
    });
  });
},
//request API Python
pythonRequest = (senderId, dataUser, message) => {
  let
    body = {
      sender: {
        "external-id": senderId,
				"first-name": dataUser.first_name,
				"last-name": dataUser.last_name,
				"facebook-data": dataUser
      },
      text: message
    }
  ;
  return new Promise((resolve, reject) => {
    console.log('----%s REQUEST python senderId %s----', currentTime, senderId);
    console.log(body);
    console.log('--------------------------------------------------');
    //envía solicitud al API de python
    request({
      method: 'POST',
      url: PYTHON_API,
      json: body,
    }, (error, response, body) => {
      let
      fail = error ? error : '',
      statusCode = error ? 500 : response.statusCode,
      statusMessage = error ? 'Error' : response.statusMessage,
      resPython = body ? body : '';

      console.log('----%s RESPONSE python senderId %s----', currentTime, senderId);
      console.log('statusCode:', statusCode);
      console.log('statusMessage:', statusMessage);
      console.log(resPython, fail);
      console.log('---------------------------------------------------');
      !statusCode ? reject(new Error(error)) : resolve({statusCode: statusCode, body: body});
    });
  });
}

module.exports = ({
  facebookRequest,
  pythonRequest
});
