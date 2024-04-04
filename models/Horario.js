const mongoose = require('mongoose');

const horarioEsquema = new mongoose.Schema({
    docente : String,
    dia : String,
    hora_entrada : String,
    hora_salida : String
})

const HorarioModel = mongoose.model('Horario',horarioEsquema,'horario');
module.exports = HorarioModel;