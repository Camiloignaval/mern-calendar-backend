const { Router } = require('express');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const router = Router()
const { check } = require('express-validator');
const validarCampos = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validarJWT');


// Rutas de usuarios/Auth
// host + /api/auth

router.post('/new',
    // middlewares
    [
        check('name', 'El nombre es obligatorio').notEmpty(),
        check('email', 'Email es obligatorio').isEmail(),
        check('password', 'La contraseña debe tener almenos 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    crearUsuario)

router.post('/',
    // middlewares
    [
        check('email', 'Email es obligatorio').isEmail(),
        check('password', 'La contraseña debe tener almenos 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario)

router.get('/renew', validarJWT, revalidarToken)



module.exports = router;