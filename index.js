//Requerimos los modulos instalados
let express = require('express');
let app = express();
let http = require('http');
let server = http.createServer(app);
let { Server } = require("socket.io");
let io = new Server(server);
let connection = require('./db/mysql');
let cookieParser = require('cookie-parser')
let session = require("express-session");

let sessionMiddleware = session({
    secret: 'keyUltraSecret',
    resave: true,
    saveUninitialized: true
});

io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next)
})

app.use(sessionMiddleware);
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



//Modulo para poder renderizar html
let engines = require('consolidate');
let routes = require('./app/routes');
app.use('/', routes)
app.use(express.static(__dirname + '/public'));

//renderizar html con las vistas
app.set('views', __dirname + '/views'); 
app.engine('html', engines.mustache);
app.set('view engine', 'html');

//seccion de chat
io.on('connection', (socket)=> {
    let req =  socket.request;
    // console.log(req.session);

    let { usuario, usuarioId } = req.session;

    if(usuarioId != null){
        connection.query('SELECT * FROM usuarios where  id= ?', [usuarioId],
        (errors, results, fields) => {
            console.log(`Sesion iniciada con el ID_usuario: ${usuarioId} y usuario ${usuario}`);
            socket.emit('logged_in', {usuario: usuario});
        });
    }else{
        console.log('No se ha iniciado session');
    }

    socket.on('mjsNuevo', (data) => {
        console.log(data);
        const sala = 0;


        connection.query('INSERT INTO mensajes( mensaje , user_id, sala_id, fecha ) VALUES (?,?,?,CURDATE()) ', [data, usuarioId, sala],
        (error, results, fields) => {
            if(!error){
                console.log(results);
                console.log('Mensaje agregado correctamente');

                socket.broadcast.emit('mensaje', {
                    usuario: usuario,
                    mensaje: data
                });

                socket.emit('mensaje', {
                    usuario: usuario,
                    mensaje: data
                });
            }
        });
    });

    socket.on('salir', (requ, res) => {
        req.session.destroy();
    });
    
});


//Puerto escuchando
server.listen(3000, (req, res) => {
    console.log('Escuchando por el puerto 3000');
})
