//Requerimos los modulos instalados
let express = require('express');
let app = express();
let http = require('http');
let server = http.createServer(app);
let { Server } = require("socket.io");
let io = new Server(server);
let connection = require('./db/mysql');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Modulo para poder renderizar html
let engines = require('consolidate');

//Direccion a las rutas
let routes = require('./app/routes');
app.use('/', routes)

//Archivos estaticos (js, css)
app.use(express.static(__dirname + '/public'));

//renderizar html con las vistas
app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

//seccion de chat
io.on('connection', (req, res)=> {
    console.log('a user connected');

    
});


//Puerto escuchando
server.listen(3000, (req, res) => {
    console.log('Escuchando por el puerto 3000');
})
