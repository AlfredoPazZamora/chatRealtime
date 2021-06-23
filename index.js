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

const nameBot = 'BotChat';

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
const { Socket } = require('dgram');
app.use('/', routes)
app.use(express.static(__dirname + '/public'));

//renderizar html con las vistas
app.set('views', __dirname + '/views'); 
app.engine('html', engines.mustache);
app.set('view engine', 'html');

//seccion de chat
io.on('connection', (socket)=> {
    let req =  socket.request;
    
    let roomId = 0;

    let { usuario, usuarioId, roomName } = req.session;
    console.log('Entre a ' + roomName);
    
    socket.emit('historial');
    socket.join(roomName);  
    botTxt('entroSala');
    
    if(usuarioId != null){
        connection.query('SELECT * FROM usuarios where  id= ?', [usuarioId],
        (errors, results, fields) => {
            console.log(`Sesion iniciada con el ID_usuario: ${usuarioId} y usuario ${usuario}`);
            socket.emit('logged_in', {usuario: usuario, sala: roomName});
        });
    }else{
        console.log('No se ha iniciado session');
    } 

    socket.on('historial', ()=>{
        console.log(`Buscando historial de la sala ${roomName}`);
        connection.query('SELECT * FROM salas where nombre_sala = ?',[roomName], (err, result, fields) => {
       
            let id = -1;
            let resultArray = Object.values(JSON.parse(JSON.stringify(result)));
            resultArray.forEach( v => id = v.id );
            
            console.log(id)
 
            console.log(`Buscando historial de la sala ${roomName}`);
 
            let sql =  `SELECT salas.nombre_sala, usuarios.usuario, mensajes.mensaje FROM mensajes 
                        INNER JOIN salas ON salas.id = mensajes.sala_id 
                        INNER JOIN usuarios ON usuarios.id = mensajes.user_id 
                        WHERE salas.id = ${id} 
                        ORDER BY mensajes.id ASC`;
 
            connection.query(sql, (err, result, fields) => {
                if(err) throw err
                socket.emit('mostrarHistorial', result);
            })
        })
    });

    socket.on('mjsNuevo', (data) => {
        connection.query('SELECT * FROM salas where nombre_sala = ?', [roomName],(err, result, field) => {
            if(!err){
                let sala = result[0].id;
                connection.query('INSERT INTO mensajes( mensaje , user_id, sala_id, fecha ) VALUES (?,?,?,CURDATE()) ', [data, usuarioId, sala],
                (error, results, fields) => {
                    if(!error){
                        console.log('Mensaje agregado correctamente');
        
                        socket.broadcast.to(roomName).emit('mensaje', {
                            usuario: usuario,
                            mensaje: data,
                            roomId: roomId
                        });
        
                        socket.emit('mensaje', {
                            usuario: usuario,
                            mensaje: data,
                            roomId: roomId
                        });
                    }
                });
            }else{
                console.log(err);
            }
            
        })

    });

    socket.on('getSalas', (data) => {
        connection.query('SELECT * FROM salas', (err, result, fields) => {
            if(err) throw err
            socket.emit('salas', result);   
        });
    })

    socket.on('cambioSala', (data) => {
        const idSala = data.idSala;
        let nombreSala = data.nombreSala;

        socket.leave(roomName);

        roomId = idSala;
        roomName = nombreSala;

        socket.join(roomName),
        botTxt('cambioSala');
    })

    socket.on('salir', (requ, res) => {
        socket.leave(roomName);
        botTxt('seFue')
        req.session.destroy();
    });
    
    function botTxt(data){
        entroSala = `Bienvenido a la sala ${roomName}`;
        cambioSala = `Cambiaste a la sala ${roomName}`;
        seFue = `El usuario ${usuario} ha salido de la sala`;  

        if(data == "entroSala"){
            socket.emit('mensaje',{
                usuario: nameBot,
                mensaje: entroSala
            })
        }else if(data == 'cambioSala'){
            socket.emit('mensaje',{
                usuario: nameBot,
                mensaje: cambioSala
            })
        }else{
            socket.emit('mensaje',{
                usuario: nameBot,
                mensaje: seFue 
            })
        }
    }
    
})
//Puerto escuchando
server.listen(3000, (req, res) => {
    console.log('Escuchando por el puerto 3000');
});
