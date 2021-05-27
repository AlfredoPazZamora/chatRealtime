let router = require('express').Router();

//Requerimos las rutas de los archivos
let chat = require('./chat');
let login = require('./login');

//usamos las rutas
router.use('/', login);
router.use('/chat', chat);

module.exports = router;