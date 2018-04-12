'use strict'
const
  API = require('./connectAPIS'),
  SETTINGS = require('../models/settingsModels')
;

var
  action = 'persistent_menu',
  method = 'POST',
  uri ='me/messenger_profile'
;

//inicia la pantalla de bienvenida
var setWelcomeScreen = (settings) => {
  return new Promise((resolve, reject) => {
    let actions = [], body;

    settings.persistentMenu.forEach(menu => {
      actions.push(menu);
    });

    body = {
      get_started: {
        payload: settings.greetingButton
      },
      greeting: [{
        locale: "default",
        text: settings.greeting
      }],
      persistent_menu: [{
        locale: "default",
        call_to_actions: actions
      }]
    }

    API.facebookRequest(action, method, uri, body)
    .then(() =>  {
      return SETTINGS.putUpdatedMenu(settings._id)
    })
    .then(() => resolve())
    .catch(error => {return reject(error)});

  });
}

module.exports = ({
  setWelcomeScreen
});
