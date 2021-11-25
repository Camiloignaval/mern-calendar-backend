const { Router } = require('express');
const { check } = require('express-validator');
const { getEventos, crearEventos, actualizarEvento, eliminarEvento } = require('../controllers/events');
const isDate = require('../helpers/isDate');
const validarCampos = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validarJWT');
const router = Router()


// Rutas de usuarios/Events
// host + /api/events

// Todas deben validar token
router.use(validarJWT)

// obtener eventos
router.get('/', getEventos);

// Crear nuevo evento
router.post('/',
    [
        check('title', 'Titulo es obligatorio').notEmpty(),
        check('start', 'Fecha de inicio es obligatorio').custom(isDate),
        check('end', 'Fecha de termino es obligatorio').custom(isDate),
        validarCampos
    ],
    crearEventos);

// actualizar evento
router.put('/:id', actualizarEvento);

// borrar evento
router.delete('/:id', eliminarEvento);

module.exports = router