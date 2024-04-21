const mongoose = require('mongoose');
/*
const horarioEsquema = new mongoose.Schema({
    docente : String,
    nro_ci: String,
    dia : String,
    hora_entrada : String,
    hora_salida : String,
    estado : String,

})*/

const horarioEsquema = new mongoose.Schema({
    nro_ci: { type: String, required: true }, // Número de CI (Cédula de Identidad)
    nombre: { type: String, required: true }, // Nombre del empleado
    apellido_paterno: { type: String, required: true }, // Apellido paterno del empleado
    apellido_materno: { type: String, required: true }, // Apellido materno del empleado
    dia: { type: String, enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'], required: true }, // Día de la semana
    hora_entrada: { type: String, required: true }, // Hora de entrada (en formato HH:MM)
    hora_salida: { type: String, required: true }, // Hora de salida (en formato HH:MM)
    estado: { type: String, enum: ['Activo', 'Inactivo'], required: true }, // Estado del horario
    registrado_por: { type: String, required: true }, // Usuario que registró el horario
    fecha_registro: { type: Date, default: Date.now } // Fecha de registro del horario
});
const HorarioModel = mongoose.model('Horario',horarioEsquema,'horario');
module.exports = HorarioModel;