'use strict'
const API = require('./connectAPIS');
//Activa botón Empezar, saludo y menú persistente
var setInitiatlActiva = () => {
  let header = {
    "content-type": "application/json"
  };
  let body = {
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
  }
  API.setGreetingMenu(header, body);
}

module.exports = ({
  setInitiatlActiva
});
