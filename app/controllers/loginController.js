let connection = require("../../db/mysql");

module.exports = {

    index: (req, res) => {
        res.render('login');
    },

    auth: (req, res) => {
        let usuario  = req.body.usuario;
        let pw       = req.body.pw

        if(usuario && pw){
            connection.query('SELECT * FROM usuarios WHERE usuario = ? AND pw = ?', [usuario, pw], 
            (error, results, fields) => {
                if(results.length > 0){
                    req.session.loggedin = true;
                    req.session.usuario = usuario;

                    res.redirect('/home');
                }else{
                    res.send('Usuario y contraseña incorrectos <br><br> si no tienes una cuenta puedes <a href="/registro">registrarte aquí</a>');
                }
                res.end();
            });
        }else{
            res.send('Favor de ingresar usuario y contraseña');
            res.end();
        }
    },

    home: (req, res) => {
        if(req.session.loggedin){
            res.render('chat', {usuario: req.session.usuario});
        }else{
            res.send('Iniciar sesion de nuevo, gracias');
        }
    }

}