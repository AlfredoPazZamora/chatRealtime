let socket = io('http://localhost:3000');

$(document).ready(function(){
    

    socket.on('logged_in', (data) => {
        $('#usernameTag').append(data.usuario);
        console.log(data);
    })

    $('#enviarMensaje').click(() => {
        if($('#mensaje').val().length <= 0){
            alert('Escriba un mensaje');
        }else{
            let mensaje = $('#mensaje').val();
            console.log(mensaje);
            socket.emit('mjsNuevo', mensaje);
        }
    });

    socket.on('mensaje', ({usuario, mensaje}) => {
        let nuevoMensaje = `<li> <strong>${usuario}:</strong> ${mensaje} </li>`;
        $('#messages').append(nuevoMensaje);
        // window.scrollTo(0, document.body.scrollHeight);
        $('#mensaje').val("");
    });

    $('.logout').click(() => {
        socket.emit('salir')
    });
})




