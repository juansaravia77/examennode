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
        nro_ci: req.body.nro_ci,
        nombre: req.body.nombre,
        apellido_paterno: req.body.apellido_paterno,
        apellido_materno: req.body.apellido_materno,
        dia: req.body.dia,
        hora_entrada: req.body.hora_entrada,
        hora_salida: req.body.hora_salida,
        estado: req.body.estado,
        registrado_por: req.body.registrado_por,
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
        res.json({mensaje: 'Horario eliminada correctamente'});
        
    } catch(error){
        res.status(400).json({mensaje: error.message});
    }
});

// 1- Listar todos los Horarios por nombre docente
rutas.get('/horario-docente/:nombre', async (req, res) =>{
    try {
        const nombre = req.params.nombre;
        const horarioDocente = await HorarioModel.find({ docente: nombre});
        res.json(horarioDocente);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});
// 2- Listar dias 
rutas.get('/dia/:dia', async (req, res) =>{
    try {
        console.log(req.params.dia);
        const horario = await HorarioModel.find({dia: req.params.dia });
        res.json(horario);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});
// 3- ordenar por dia
rutas.get('/dia-orden', async (req, res) =>{
    try {
        const horario = await HorarioModel.find().sort({dia: -1 });
        res.json(horario);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});

// 4- docente por hora de entrada
rutas.get('/horas-entrada/:hora', async (req, res) =>{
    try {
        const Entrada = req.params.hora;
        const result = await HorarioModel.find({ hora_entrada: Entrada });
        res.json(result);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error al procesar la solicitud');
    }
});

// 5- listados de docente por rango de horas
rutas.get('/horas-rango/:entrada/:salida', async (req, res) => {
    try {
        const Entrada = req.params.entrada;
        const Salida = req.params.salida;

        const result = await HorarioModel.find({ 
            hora_entrada: { $gte: Entrada },
            hora_salida: { $lte: Salida }
        });

        res.json(result);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error al procesar la solicitud');
    }
});
// 6- listado de docentes que contengan una letra o palabra
rutas.get('/docentes-nombre/:letra', async (req, res) => {
    try {
        const letra = req.params.letra;

        const result = await HorarioModel.find({ 
            docente: { $regex: `.*${letra}.*`, $options: 'i' }
        });

        res.json(result);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error al procesar la solicitud');
    }
});
// 7- listado de por hora de salida
rutas.get('/horas-salida/:hora', async (req, res) =>{
    try {
        const Salida = req.params.hora;
        const result = await HorarioModel.find({ hora_salida: Salida });
        res.json(result);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error al procesar la solicitud');
    }
});
// 8- docentes que no trabajan un dia especifico
rutas.get('/docentes/:dia', async (req, res) => {
    try {
        const dia = req.params.dia;
        const result = await HorarioModel.find({ 
            dia: { $ne: dia } // $ne significa "no igual a"
        });

        res.json(result);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error al procesar la solicitud');
    }
});

// 9- numero de dias que trabaja un docente
rutas.get('/dias-trabajo/:docente', async (req, res) => {
    try {
        const docente = req.params.docente;
        const result = await HorarioModel.countDocuments({ docente });

        res.json({ docente, dias_trabajo: result });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error al procesar la solicitud');
    }
});
//10- orden por nombre
rutas.get('/docente-orden', async (req, res) =>{
    try {
        const horario = await HorarioModel.find().sort({docente: 1 });
        res.json(horario);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});


module.exports = rutas;