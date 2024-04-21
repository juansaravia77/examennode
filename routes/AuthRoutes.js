const express = require('express');
const rutas = express.Router();
const Usuario = require('../models/Usuario');
const listaNegraModel = require('../models/listaNegra');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/Usuario');
const nodemailer = require('nodemailer');

// registrar usuarios 
rutas.post('/registro', async (req, res) =>{
    try {
        const {nombreusuario, correo, contrasena} = req.body;
        const usuario = new Usuario ({nombreusuario, correo, contrasena});
        await usuario.save();
        res.status(201).json({mensaje: 'Usuario registrado exitosamente'});
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});
// iniciar sesion
rutas.post('/login', async (req, res) =>{
    try {
        const {correo, contrasena} = req.body;
        const usuario = await Usuario.findOne({ correo });
        //encontrar al usuario
        if (!usuario){
            res.status(401).json({mensaje: 'Usuario no encotrado. Credencial incorrecto'});
        }
        //Comparar contrasena 
        const validarContrasena = await usuario.comparePassword(contrasena);
        if (!validarContrasena){
            res.status(401).json({mensaje: 'Credencial incorrecto. Vuelva a intentarlo'});
        }
        const token = jwt.sign( { userId: usuario._id }, 'clave_secreta_servidor',{expiresIn: '1h'});
        res.json(token);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});

rutas.post('/logout', async (req, res) =>{
    // console.log(req.body);
    const nuevalistaNegra = new listaNegraModel({
        jwtoken: req.body.jwtoken
    });
    try {
        const listaNegra = await nuevalistaNegra.save();
        res.status(201).json({ message: 'Sesión cerrada exitosamente' });
    } catch(error){
        res.status(400).json({ message: 'Error al cerrar sesión' });
    }
});

// Configuración de nodemailer (debes proporcionar tus propias credenciales de correo electrónico)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Desactivar la verificación SSL
    auth: {
        user: 'juan.saravia.77@gmail.com',
        pass: 'dieq hwis hdtx ghvb'
    },
    tls: {
        rejectUnauthorized: false
    }
});

rutas.post('/forgot-password', async (req, res) => {
    try{
        const email = req.body.correo;
        console.log(email); 
        const usuario = await UsuarioModel.findOne({ correo: email });
        if (!usuario) {
            return res.status(404).send('Usuario no encontrado');
        }else{
            //res.json(usuario);
            // Generar una nueva contraseña aleatoria
            const newPassword = generateRandomPassword();
            // Hash de la nueva contraseña
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            // Actualizar la contraseña del usuario en la base de datos (en este caso, actualizamos en el array de usuarios simulado)
            console.log(newPassword);
            await UsuarioModel.updateOne(
                { correo: email },
                { $set: { contrasena: hashedPassword } }
            );
            //usuario.contrasena = hashedPassword;
            console.log(hashedPassword);
            const mailOptions = {
                from: 'juan.saravia.77@gmail.com',
                to: email,
                subject: 'Nueva contraseña',
                text: 'Tu nueva contraseña es: ' + newPassword
            };
            console.log(mailOptions.to);
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Error al enviar el correo electrónico');
                } else {
                    console.log('Correo electrónico enviado: ' + info.response);
                    res.send('Se ha enviado un correo electrónico con la nueva contraseña: ' + newPassword);
                }
            });
        }
    }catch(error){
        res.status(400).json({ message: 'Error al buscar usuario por correo' });
    }
    
});
// Función para generar una contraseña aleatoria
function generateRandomPassword() {
    const length = 6;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newPassword = '';
    for (let i = 0; i < length; i++) {
        newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return newPassword;
}

module.exports = rutas;