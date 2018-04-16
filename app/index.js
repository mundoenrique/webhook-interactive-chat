'use strict'
const
//Dependencias
config = require('config'),
mongoose = require('mongoose'),
redis = require('redis'),
app = require('./app'),
botConfig = require('./webhook/botConfig'),
settings = require('./models/settingsModels'),
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
REDIS_CLIENT = redis.createClient(REDIS_PORT, REDIS_HOST);

app.set('port', APP_PORT);

//ConeEctar Redis
REDIS_CLIENT.on('connect', () => {
  console.log('------------------Iniciando la aplicación------------------');
  console.log('Redis se está ejecutando satisfactoriamente');
  //Conectar mongo
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://' + MONGO_HOST + ':' + MONGO_PORT + '/' + MONGO_COLLECTION)
  .then(() => {
    console.log('Colección de Mongo \"%s\" lista', MONGO_COLLECTION);

    //Obtener los parámetros para la pantalla de bienvenida
    return settings.getSettings();
  })
  .then(settings => {
    //Si "updated" es "true" envia la solictud de activación de la pantalla de bienvenida
    return settings.updated ? botConfig.setWelcomeScreen(settings) : true;
  })
  .then(() => {
    //Iniciar del servidor nodeJs
    app.listen(app.get('port'), () => {

      console.log('La aplicación nodeJS está corriendo sobre el puerto ', app.get('port'));
      console.log('-----------------------------------------------------------');
    });
  })
  .catch(error => console.log(error));
});
