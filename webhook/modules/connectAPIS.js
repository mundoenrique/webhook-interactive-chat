'use strict'
const
  //Dependencias
  config = require('config'),
  request = require('request'),
  //Token generado por el portal de facebook developers
  MSN_ACCESS_TOKEN = (process.env.MSN_ACCESS_TOKEN) ? process.env.MSN_ACCESS_TOKEN : config.get('msnAccessToken'),
  //API ´de facebook
  FACEBOOK_API = (process.env.FACEBOOK_API) ? process.env.FACEBOOK_API : config.get('faceBookAPI');

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
var getFacebookDataUser = (senderId, _setDatauser_) => {
  console.log('<<<<====REQUEST datos públicos del usuario====>>>>');
  console.log('senderID:', senderId);
  console.log('--------------------------------------------------');
  request({
    method: 'GET',
    url: FACEBOOK_API + senderId,
    qs: {
      access_token: MSN_ACCESS_TOKEN
    },
  }, (error, response, data) => {
    console.log('<<<<====RESPONSE datos públicos del usuario====>>>>');
    let fail = '';

    if(error !== null || response.statusCode !== 200) {
      fail = error != null ? error : fail;
    }

    console.log('statusCode:', response.statusCode);
    console.log(data, fail);
    console.log('---------------------------------------------------');
    _setDatauser_(data)
  });

}

module.exports = ({
  getFacebookDataUser,
  setGreetingMenu
})
