let router = require('express').Router();
let loginControlador = require('../controllers/loginController');
let session = require("express-session");

let sessionMiddleware = session({
    secret: 'keyUltraSecret',
    resave: true,
    saveUninitialized: true
});

router.use(
    session({
      secret: "secret",
      resave: true,
      saveUninitialized: true,
    })
);

//GET
router.get('/', (req, res) => {
    loginControlador.index(req, res);
});

router.get('/home', (req, res) => {
    loginControlador.home(req, res);
})

//POST
router.post('/auth', (req, res) => {
    loginControlador.auth(req, res);
})

module.exports = router;