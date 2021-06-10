$(document).ready(function(){
    let socket = io('http://localhost:3000');
    let salas = [];
    
    socket.emit('getSalas');

    socket.on('salas', (data) => {
        $.each(data, (id, val) => {
            salas.push(data[id].nombre_sala);
        });
        console.log(salas);
        getSalas(salas);
    });

    function getSalas(data){
        $.each(data, (id, val) => {
            $('#rooms').append($('<option>', {
                value: id,
                text: data[id],
                id: data[id]
            }));
        });
    }
})