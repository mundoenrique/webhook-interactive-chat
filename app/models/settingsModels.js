'use strict'
const
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId
;
var
  settingsSchema = Schema({
    _id: ObjectId,
    name: String,
    updated: Boolean,
    greetingButton: String,
    greeting: String,
    persistentMenu: [],
  }),
  Settings = mongoose.model('Settings', settingsSchema)
;

//Obtiene la configuración de la pantalla de bienvenida
var getSettings = () => {
  return new Promise((resolve, reject) => {
    Settings.findOne({name: 'settings'}, (error, settings) => {
      error ? reject(error) : resolve(settings);
    });
  });
}

//Evita que se vuelva a enviar la activación de la pantalla de bienvenida
var putUpdatedMenu = (settingsId) => {
  return new Promise((resolve, reject) => {
    Settings.findByIdAndUpdate(settingsId, {updated: false}, {new: true}, (error, response) => {
      error ? reject(error) : resolve();
    })
  });
}

module.exports = ({
  getSettings,
  putUpdatedMenu
});
