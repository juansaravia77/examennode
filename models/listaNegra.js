const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const listaNegraEsquema = new mongoose.Schema({
    jwtoken : { type: String, required: true},
})

const listaNegraModel = mongoose.model('ListaNegra',listaNegraEsquema,'listaNegra');
module.exports = listaNegraModel;