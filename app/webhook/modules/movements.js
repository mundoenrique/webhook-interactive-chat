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
getCardMovements = (senderId, responsePython) => {
  let
  date,
  movements = [],
  cardMovements = HELP.objectTrasform(responsePython.cardmovements);

  cardMovements.forEach(movement => {
    let element = {};
    date = new Date(movement.date);
    date = monment(date).format('DD-MM-YYYY');
    element['date'] = date;
    element['amount'] = movement.amount;
    element['sign'] = movement.sign;
    element['desc'] = movement.description.substring(0, 17) + '...';
    movements.push(JSON.stringify(element));
  });

  REDIS_CLIENT.rpush('moves-' + senderId, movements, (error, reply) =>{
    console.log('rpush ERROR----------------------', error)
    console.log('rpush----------------------', reply)

    REDIS_CLIENT.expire('moves-' + senderId, 10, (error, reply) => {
      console.log('expire error----------------', error)
      console.log('expire----------------', reply)
    })
  });

}

module.exports = ({
  getCardMovements
});
