const express = require('express');
const { dbConnection } = require('./dataBase/config');
const cors = require('cors');
require('dotenv').config()

const app = express()

// Base de datos
dbConnection()

// cors
app.use(cors())

// lectura y parseo de body
app.use(express.json())

// directorio publico
app.use(express.static('public'));

// Rutas
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))


// escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${process.env.PORT}`)
})