const { response } = require('express')
const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');



const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body
    try {
        let usuario = await Usuario.findOne({ email })

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Correo ya esta registrado',

            })
        }
        usuario = new Usuario(req.body)

        // encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt)

        await usuario.save();

        const token = await generarJWT(usuario.id, usuario.name)
        res.status(201).json({
            ok: true,
            uid: usuario._id,
            name: usuario.name,
            token

        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            ok: false,
            msg: 'Porfavor hable con el administrador',

        })
    }
}

const loginUsuario = async (req, res = response) => {
    const { email, password } = req.body

    try {
        const usuario = await Usuario.findOne({ email })
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Correo no existe en registros',

            })
        }

        // confirmar password
        const validPassword = bcrypt.compareSync(password, usuario.password)

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password Incorrecto',

            })
        }

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name)

        res.status(201).json({
            ok: true,
            uid: usuario._id,
            name: usuario.name,
            token

        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Porfavor hable con administrador',

        })
    }
}

const revalidarToken = async (req, res = response) => {
    const { uid, name } = req

    // generar nuevo jwt
    const token = await generarJWT(uid, name)



    res.json({
        ok: true,
        token, uid, name
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}