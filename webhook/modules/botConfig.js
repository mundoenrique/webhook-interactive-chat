'use strict'
const API = require('./connectAPIS');
//Activa botón Empezar, saludo y menú persistente
var setInitiatlActiva = () => {
  let
    action = 'persistent_menu',
    method = 'POST',
    header = {
    "content-type": "application/json"
  },
  uri ='me/messenger_profile',
  senderId = '',
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
          payload: "Preguntas"
        }
      ]
    }]
  };

  API.facebookRequest(action, method, header, uri, senderId, body)
    .then(body => {})
    .catch(error => console.log('Erorr====>>>>', error));
  //API.setGreetingMenu(header, body);
}

module.exports = ({
  setInitiatlActiva
});
