const express = require('express');
const cors = require('cors');
const session = require('express-session')

const userRoutes = require('./routes/userRoutes')
const loginRoutes = require('./routes/loginRoutes')
const signUpRoutes = require('./routes/signUpRoutes')

require('dotenv').config();

const server = express();

server.use(cors());
server.use(express.json());

const IN_PROD = process.env.NODE_ENV === 'production'
const TWO_HOURS = 1000 * 60 * 60 * 2

server.use(session({
    name: process.env.NODE_SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret: process.env.NODE_SESSION_SECRET,
    cookie: {
        maxAge: TWO_HOURS,
        sameSite: true,
        secure: IN_PROD
    }
}))

const redirectHome = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/home')
    } else {
        next()
    }
}

const verifyJWT = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        console.log(bearerToken)
        next();
    } else {
        res.sendStatus(401);
    }
}

server.use('/signup', signUpRoutes);
server.use('/user', verifyJWT, userRoutes);
server.use('/login', loginRoutes);
server.use('/logout', (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            res.status(400).json({ error: "Ocorreu um erro ao tentar deslogar: " + err });
        }
        res.clearCookie(process.env.NODE_SESS_NAME)
        res.redirect('/login')
    })
});
server.listen(3333, () => {
    console.log('Server is running');
})