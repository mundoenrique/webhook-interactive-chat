'use strict'
const
  //Dependencias
  config = require('config'),
  request = require('request'),
  //Clave secreta de la aplicación MESSENGER
  MSN_APP_SECRET = (process.env.MSN_APP_SECRET) ? process.env.MSN_APP_SECRET : config.get('msnAppSecret'),
  //Token generado por el portal de facebook developers
  MSN_ACCESS_TOKEN = (process.env.MSN_ACCESS_TOKEN) ? process.env.MSN_ACCESS_TOKEN : config.get('msnAccessToken'),
  //API ´de facebook
  FACEBOOK_API = (process.env.FACEBOOK_API) ? process.env.FACEBOOK_API : config.get('faceBookAPI');

var getFacebookDataUser = (senderId, _setDatauser_) => {

  _setDatauser_(senderId)
}

//Configura inicio del bot
var setGreetingMenu = (header, body) => {
  request({
    method: 'POST',
    headers: header,
    url: FACEBOOK_API + 'me/messenger_profile',
    qs: {access_token: MSN_ACCESS_TOKEN},
    json: body
  }, (error, response, body) => {
    console.log('<<<<====Activar botón \"Empezar\", saludo y menú persistente====>>>>');
    let fail = '';

    if(error !== null || response.statusCode !== 200) {
      fail = error != null ? error : fail;
    }

    console.log('statusCode:', response.statusCode);
    console.log(body, fail);
    console.log('-----------------------------------------------------------');

  });
}

module.exports = ({
  getFacebookDataUser,
  setGreetingMenu
})
