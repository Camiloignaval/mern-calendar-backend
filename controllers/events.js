const { response } = require('express');
const Evento = require('../models/Evento');


const getEventos = async (req, res = response) => {
    const eventos = await Evento.find()
        .populate('user', 'name')

    res.status(200).json({
        ok: true,
        eventos
    })
}


const crearEventos = async (req, res = response) => {

    const evento = new Evento(req.body)

    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save()
        res.status(200).json({
            ok: true,
            evento: eventoGuardado
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}


const actualizarEvento = async (req, res = response) => {
    const { id: EventoId } = req.params
    const uid = req.uid
    try {
        const evento = await Evento.findById(EventoId)
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe evento con ese Id'
            })
        }
        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No esta autorizado para esta accion'
            })
        }
        const nuevoEvento = {
            ...req.body,
            user: uid
        }
        const eventoEliminado = await Evento.findByIdAndUpdate(EventoId, nuevoEvento, { new: true })

        res.status(200).json({
            ok: true,
            evento: eventoEliminado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const eliminarEvento = async (req, res = response) => {
    const { id: EventoId } = req.params
    const uid = req.uid
    try {
        const evento = await Evento.findById(EventoId)
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe evento con ese Id'
            })
        }
        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No esta autorizado para esta accion'
            })
        }

        await Evento.findByIdAndDelete(EventoId)

        res.status(200).json({
            ok: true,
            msg: 'Evento eliminado'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getEventos,
    crearEventos,
    actualizarEvento,
    eliminarEvento
}