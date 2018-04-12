'use strict'
const
  api = require('./connectAPIS'),
  settings = require('../models/settingsModels')
;

var
  action = 'persistent_menu',
  method = 'POST',
  uri ='me/messenger_profile'
;

//inicia la pantalla de bienvenida
var setWelcomeScreen = (setting) => {
  return new Promise((resolve, reject) => {
    let actions = [], body;

    setting.persistentMenu.forEach(menu => {
      actions.push(menu);
    });

    body = {
      get_started: {
        payload: setting.greetingButton
      },
      greeting: [{
        locale: "default",
        text: setting.greeting
      }],
      persistent_menu: [{
        locale: "default",
        call_to_actions: actions
      }]
    }

    api.facebookRequest(action, method, uri, body)
    .then(() =>  {
      return settings.putUpdatedMenu(setting._id)
    })
    .then(() => resolve())
    .catch(error => {reject(error)});
  });
}

module.exports = ({
  setWelcomeScreen
});
