'use strict'
const
mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;
var
settingsSchema = Schema({
  _id: ObjectId,
  name: String,
  updated: Boolean,
  greetingButton: String,
  greeting: String,
  persistentMenu: [],
}),
Settings = mongoose.model('Settings', settingsSchema),
fail, good;

//Obtiene la configuración de la pantalla de bienvenida
var getSettings = () => {
  return new Promise((resolve, reject) => {
    console.log('--------Buscando datos de configuración inicial--------')
    Settings.findOne({name: 'settings'}, (error, settings) => {
      fail = error ? error : '',
      good = settings ? 'success' : '';
      console.log(good, fail);
      console.log('------------------------------------------------------------------------');
      error ? reject(error) : resolve(settings);
    });
  });
}

//Evita que se vuelva a enviar la activación de la pantalla de bienvenida
var putUpdatedMenu = (settingsId) => {
  return new Promise((resolve, reject) => {
    console.log('--------Actualiza a false configuración Inicial--------')
    Settings.findByIdAndUpdate(settingsId, {updated: false}, {new: true}, (error, response) => {
      fail = error ? error : '',
      good = response ? 'success' : '';
      console.log(good, fail);
      console.log('------------------------------------------------------------------------');
      error ? reject(error) : resolve();
    })
  });
}

module.exports = ({
  getSettings,
  putUpdatedMenu
});
