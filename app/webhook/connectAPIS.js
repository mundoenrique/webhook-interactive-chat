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
  PYTHON_API = process.env.PYTHON_API ? process.env.PYTHON_API : config.get('pythonAPI')
;

//Request al API e facebook
var facebookRequest = (action, method, uri, body) => {
  let
    msg,
    senderId = body.recipient ? body.recipient.id : '',
    userId = ''
  ;

  switch (action) {
    case 'persistent_menu':
      msg = 'Activar botón \"Empezar\", saludo y menú persistente';
      break;
    case 'dataUser':
      msg = 'datos públicos del usuario: senderId ';
      userId = senderId;
      break;
    case 'markSeen':
    case 'typingOn':
    case 'typingOff':
    msg = 'mensaje al usuario: senderId ';
      break;

  }
  return new Promise((resolve, reject) => {
    console.log('--------REQUEST facebook %s %s--------', msg, senderId);
    console.log(body);
    console.log('--------------------------------------------------');
    request({
      method: method,
      headers: {"content-type": "application/json"},
      url: FACEBOOK_API + uri + userId,
      qs: {access_token: MSN_ACCESS_TOKEN},
      json: body,
    }, (error, response, body) => {
      let fail = error ? error : '';
      console.log('--------RESPONSE facebook %s %s--------', msg, senderId);
      console.log('statusCode:', response.statusCode);
      console.log(body, fail);
      console.log('---------------------------------------------------');
      response.statusCode !== 200 ? reject(action) : resolve(body);
    });
  });
}

//request API Python
var pythonRequest = (senderId, dataUser, message) => {
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
    console.log('----REQUEST python senderId %s----', senderId);
    console.log(body);
    console.log('--------------------------------------------------');
    request({
      method: 'POST',
      url: PYTHON_API,
      json: body,
    }, (error, response, body) => {
      let fail = error ? error : '';
      console.log('----RESPONSE python senderId %s----', senderId);
      console.log(body, fail);
      console.log('---------------------------------------------------');
      error ? reject('falló la comunicación con: %s', PYTHON_API) : resolve(body);
    });
  });
}

//Configura inicio del bot
var setGreetingMenu = (header, body) => {
  console.log('<<<<====Activar botón \"Empezar\", saludo y menú persistente====>>>>');
  request({
    method: 'POST',
    headers: header,
    url: FACEBOOK_API + 'me/messenger_profile',
    qs: {access_token: MSN_ACCESS_TOKEN},
    json: body
  }, (error, response, body) => {
    let fail = '';

    if(error !== null || response.statusCode !== 200) {
      fail = error != null ? error : fail;
    }

    console.log('statusCode:', response.statusCode);
    console.log(body, fail);
    console.log('------------------------------------------------------------------');

  });
}

//Solicita datos públicos del usuario a facebook
var getFacebookDataUser = (senderId) => {
  return new Promise((resolve, reject) => {
    console.log('<<<<====REQUEST datos públicos del usuario====>>>>');
    console.log('senderID:', senderId);
    console.log('--------------------------------------------------');
    request({
      method: 'GET',
      url: FACEBOOK_API + senderId,
      qs: {access_token: MSN_ACCESS_TOKEN}
    }, (error, response, body) => {
      let fail = error != null ? error : '';
      console.log('<<<<====RESPONSE datos públicos del usuario====>>>>');
      console.log('statusCode:', response.statusCode);
      console.log(body, fail);
      console.log('---------------------------------------------------');
      return response.statusCode !== 200 ? reject() : resolve(body);
    });
  });
}

module.exports = ({
  facebookRequest,
  pythonRequest
});
