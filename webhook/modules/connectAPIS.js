'use strict'
const
  //Dependencias
  config = require('config'),
  request = require('request'),
  //Token generado por el portal de facebook developers
  MSN_ACCESS_TOKEN = (process.env.MSN_ACCESS_TOKEN) ? process.env.MSN_ACCESS_TOKEN : config.get('msnAccessToken'),
  //API ´de facebook
  FACEBOOK_API = (process.env.FACEBOOK_API) ? process.env.FACEBOOK_API : config.get('faceBookAPI');

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
      msg = 'mensaje al usuario: senderId ';
      break;

  }
  return new Promise((resolve, reject) => {
    console.log('--------REQUEST ' + msg + senderId + '--------');
    console.log(body);
    console.log('--------------------------------------------------');
    request({
      method: method,
      headers: {"content-type": "application/json"},
      url: FACEBOOK_API + uri + userId,
      qs: {access_token: MSN_ACCESS_TOKEN},
      json: body,
    }, (error, response, body) => {
      let fail = error != null ? error : '';
      console.log('--------RESPONSE ' + msg + senderId +  '--------');
      console.log('statusCode:', response.statusCode);
      console.log(body, fail);
      console.log('---------------------------------------------------');
      return response.statusCode !== 200 ? reject(action) : resolve(body);
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
  getFacebookDataUser,
  setGreetingMenu
});
