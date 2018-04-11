'use strict'
const API = require('./connectAPIS');

//Activa botón Empezar, saludo y menú persistente
var setInitiatlActiva = (_result_) => {
  let
    action = 'persistent_menu',
    method = 'POST',
    uri ='me/messenger_profile',
    body = {
      get_started: {
        payload: "Empezar"
      },
      greeting: [{
        locale: "default",
        text: "Hola {{user_first_name}}! soy Mia, te ayudaré a realizar consultas de tus productos TEBCA. Presiona \"Empezar\" para que realices tus consultas"
      }],
      persistent_menu: [{
        locale: "default",
        call_to_actions: [
          {
            type: "postback",
            title: "Saldos",
            payload: "Saldos"
          },
          {
            type: "postback",
            title: "Movimientos",
            payload: "Movimientos"
          },
          {
            type: "postback",
            title: "Otras Consultas",
            payload: "preguntas"
          }
        ]
      }]
    };

  API.facebookRequest(action, method, uri, body)
    .then(() => {
      let error = null, result = true;
      _result_(error, result)
    })
    .catch(error => {
      console.log('Erorr====>>>>', error);
      let result = false;
      _result_(error, result);
    });
}

module.exports = ({
  setInitiatlActiva
});