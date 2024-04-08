const express = require('express');
const rutas = express.Router();
const HorarioModel = require('../models/Horario');

rutas.get('/', async (req, res) =>{
    try {
        const horarios = await HorarioModel.find();
        console.log(horarios);
        res.json(horarios);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});

rutas.post('/agregar', async (req, res) =>{
    // console.log(req.body);
    const nuevoHorario = new HorarioModel({
        docente: req.body.docente,
        dia: req.body.dia,
        hora_entrada: req.body.hora_entrada,
        hora_salida: req.body.hora_salida
    });
    try {
        const guardarHorario = await nuevoHorario.save();
        res.status(201).json(guardarHorario);
        
    } catch(error){
        res.status(400).json({mensaje: error.message});
    }
});

rutas.put('/editar/:id', async (req, res) =>{
    try {
        const actualizarHorario = await HorarioModel.findByIdAndUpdate(req.params.id, req.body, { new: true});
        res.status(201).json(actualizarHorario);
        
    } catch(error){
        res.status(400).json({mensaje: error.message});
    }
});

rutas.delete('/eliminar/:id', async (req, res) =>{
    try {
        const eliminarHorario = await HorarioModel.findByIdAndDelete(req.params.id);
        res.json({mensaje: 'Tarea eliminada correctamente'});
        
    } catch(error){
        res.status(400).json({mensaje: error.message});
    }
});

// - Listar todos los Horarios por nombre docente
rutas.get('/horario-docente/:id', async (req, res) =>{
    try {
        console.log(req.params.id);
        const horarioDocente = await HorarioModel.find({ docente: req.params.id});
        res.json(horarioDocente);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});
// - Listar todos los Horarios por nombre que empiece en una lera especifica 
rutas.get('/dia/:nombre', async (req, res) =>{
    try {
        console.log(req.params.nombre);
        const horario = await HorarioModel.find({dia: req.params.nombre });
        res.json(horario);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});
module.exports = rutas;