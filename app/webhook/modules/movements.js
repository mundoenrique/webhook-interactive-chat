'use strict'
const
//Dependencias
config = require('config'),
redis = require('redis'),
monment = require('moment'),
API = require('../connectAPIS'),
HELP = require('./helpers'),
//Puerto para redis
REDIS_PORT = process.env.REDIS_PORT ? process.env.REDIS_PORT : config.get('redisPort'),
//IP para redis
REDIS_HOST =  process.env.REDIS_HOST ? process.env.REDIS_HOST : config.get('redisHost'),
//Instancia para conectar redis
REDIS_CLIENT = redis.createClient(REDIS_PORT, REDIS_HOST);
var
messageData = HELP.messageData,
//Obtiene los movimientos recibidos del API python
SetMovementsRedis = (senderId, responsePython) => {
  let
  date,
  movements = [],
  cardMovements = HELP.objectTrasform(responsePython.cardmovements);

  //Construye el objeto para almacenar en REDIS
  cardMovements.forEach(movement => {
    let element = {};
    date = new Date(movement.date);
    date = monment(date).format('DD-MM-YYYY');
    element['date'] = date;
    element['amount'] = parseFloat(movement.amount).toFixed(2);
    element['sign'] = movement.sign;
    element['desc'] = movement.description.substring(0, 17) + '...';
    movements.push(JSON.stringify(element));
  });

  //Elimina la lista existentente para el usuario solicitante
  REDIS_CLIENT.del('moves-' + senderId, 'summary-' + senderId);
  //Almacena los movimientos obtenidos en REDIS
  REDIS_CLIENT.rpush('moves-' + senderId, movements, (error, reply) => {
    //Crea el resumen de los movimientos en REDIS
    REDIS_CLIENT.hmset('summary-' + senderId, ['total', reply, 'min', 1, 'max', 3]);
    //Fija tiempo de vencimiento de los datos en REDIS
    REDIS_CLIENT.expire('moves-' + senderId, 10);
    REDIS_CLIENT.expire('summary-' + senderId, 10);

    getMovementsRedis(senderId);
  });
},
//Obtiene los movimientos de REDIS
getMovementsRedis = (senderId) => {
  let total, min, max, plus, movements;
  //Obtiene el resumen de los movimientos
  new Promise((resolve, reject) => {
    REDIS_CLIENT.hgetall('summary-' + senderId, (error, reply) => {
      if(!reply && !error) {
        let messageEvent = {message:{text: 'leer'}};
        require('../handleEvents').messagePostbacks(senderId, messageEvent);
      } else {
        error ? reject(new Error(error)) : resolve(reply);
      }
    });
  })
  .then(summary => {
    total = parseInt(summary.total);
    min = parseInt(summary.min) > total ? total : parseInt(summary.min);
    max = parseInt(summary.max) > total ? total : parseInt(summary.max);
    //Incremneta el mínimo y el máximo
    REDIS_CLIENT.hincrby('summary-' + senderId, 'min', 3);
    REDIS_CLIENT.hincrby('summary-' + senderId, 'max', 3);
    //Si no existen mas movimientos elimina el resumen
    min + 3 > total ? REDIS_CLIENT.del('summary-' + senderId) : '';

    //Obtiene los ultimos 3 movimientos
    return new Promise((resolve, reject) => {
      REDIS_CLIENT.lrange('moves-' + senderId, 0, 2, (error, reply) => {
        error ? reject(new Error(error)) : resolve(reply);
      });
    });
  })
  .then(moves => {
    movements = moves;
    //Borra los movimientos obtenidos
    return new Promise((resolve, reject) => {
      REDIS_CLIENT.ltrim('moves-' + senderId, 3, -1, (error, reply) => {
        error ? reject(new Error(error)) : resolve(reply)
      });
    });
  })
  .then(() => {
    //Envía los movimientos al usuario
    sendCardMovements(senderId, total, min, max, movements)
  })
  .catch(error => console.log(error));
},
//Envía los movimientos al usuario
sendCardMovements = (senderId, total, min, max, movements) => {
  let
  plus = total > 1 ? 's' : '',
  elementsList = [{
    title: total + ' Movimiento' + plus,
    subtitle: 'Mostrando ' + min + ' al ' + max
  }];
  HELP.action = 'movements';
  for(var i = 0; i < movements.length; i++) {
    let
    element = {},
    movement = JSON.parse(movements[i]),
    sign = movement.sign === '-' ? '-' : '+';

    element['title'] = sign + ' S/' + movement.amount + ' 📅 ' + movement.date;
    element['subtitle'] = movement.desc;
    elementsList.push(element);
  }

  messageData.recipient.id = senderId;
  messageData.message = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'list',
        top_element_style: 'compact',
        elements: elementsList
      }
    }
  }
  API.facebookRequest(HELP.action, HELP.method, HELP.uri, messageData)
  .then(() => {
    if(max < total) {
      let
      rest = total - max,
      n = rest > 1 ? 'n' : '';
      plus = rest > 1 ? 's' : '';
      messageData.message = {
        text: `Resta${n} ${rest} movimiento${plus}`,
        quick_replies: [{
          content_type: 'text',
          title: 'Ver Más',
          payload: 'viewMore'
        }]
      };
      return API.facebookRequest(HELP.action, HELP.method, HELP.uri, messageData)
    }
  })
  .catch(error => console.log(error));
}

module.exports = ({
  SetMovementsRedis,
  getMovementsRedis
});
