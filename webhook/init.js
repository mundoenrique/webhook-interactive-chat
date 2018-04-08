'use strict'
const
  //Dependencias
  config = require('config'),
  mongoose = require('mongoose'),
  redis = require('redis'),
  app = require('./app'),
  botConfig = require('./modules/botConfig'),
  //Puerto de la aplicación nodeJS
  APP_PORT = (process.env.APP_PORT) ? process.env.APP_PORT : config.get('appPort'),
  //Puerto para mongo
  MONGO_PORT = process.env.MONGO_PORT ? process.env.MONGO_PORT : config.get('mongoPort'),
  //IP de mongo
  MONGO_HOST = process.env.MONGO_HOST ? process.env.MONGO_HOST : config.get('mongoHost'),
  //Esquema para Mongo
  MONGO_COLLECTION = process.env.MONGO_COLLECTION ? process.env.MONGO_COLLECTION : config.get('mongoCollection'),
  //Puerto para redis
  REDIS_PORT = process.env.REDIS_PORT ? process.env.REDIS_PORT : config.get('redisPort'),
  //IP para redis
  REDIS_HOST =  process.env.REDIS_HOST ? process.env.REDIS_HOST : config.get('redisHost'),
  //Instancia para conectar redis
  redisClient = redis.createClient(REDIS_PORT, REDIS_HOST);

  app.set('port', APP_PORT);

  //Coenctar redis
  redisClient.on('connect', () => {
    console.log('Redis se está ejecutando satisfactoriamente');
    //Conectar mongo
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://' + MONGO_HOST + ':' + MONGO_PORT + '/' + MONGO_COLLECTION).then(() => {
      console.log('Conexión a la colección de mongo \"%s\" exitosa', MONGO_COLLECTION);
      //Iniciar del servidor
      app.listen(app.get('port'), () => {
        console.log('La aplicación nodeJS está corriendo sobre el puerto ', app.get('port'));
        botConfig.setInitiatlActiva();
      });
    }).catch(error => console.log(error));
  });

