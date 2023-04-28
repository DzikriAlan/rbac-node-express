require('dotenv').config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// AKAN MEMBERIKAN SESSION ID BERUPA COOKIE
var session = require('express-session')
var passport = require('passport')
// PESAN FLASH HANYA DITAMPILKAN PADA SATU HALAMAN DAN KEMUDIAN DIHAPUS SAAT HALAMAN TERSEBUT DI REFRESH
// ATAU PENGGUNA BERPINDAH KE HALAMAN LAIN
var connectFlash = require('connect-flash')
// var MySQLStore = require('express-mysql-session')(session)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var adminRouter = require('./routes/admin');

var mustLogin = require('./middlewares/mustLogin');
var mustNotLogin = require('./middlewares/mustNotLogin');
// var ensureAdmin = require('./middlewares/ensureAdmin');
// var ensureModerator = require('./middlewares/ensureModerator');

var app = express();

// const options = {
//     host: process.env.DB_HOSTNAME,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// }

// const essionStore = new MySQLStore(options)

app.use(session({
    // UNTUK MENENTUKAN KUNCI RAHASIA YANG AKAN DIGUNAKAN UNTUK MENGENKRIPSI DATA SESSION PADA SERVER
    secret: process.env.SESSION_SECRET,
    // DIATUR MENJADI FALSE AGAR SERVER TIDAK MENYIMPAN ULANG SESSION YANG TIDAK BERUBAH
    resave: false,
    // DIATUR MENJADI FALSE AGAR SESSION TIDAK DISIMPAN TIDAK ADA DATA YANG TERKAIT
    saveUninitialized: true,
    // DIATUR MENJADI TRUE AGAR COOKIE SESSION TIDAK DAPAT DIAKSES MELALUI JAVASCRIPT
    cookie: {
        httpOnly: true
    },
    // store: sessionStore
}))

app.use(passport.initialize())
app.use(passport.session())
require('./utils/passport')
app.use((req, res, next) => {
    res.locals.user = req.user
    next()
})
app.use(connectFlash());
app.use((req, res, next) => {
    // MENGAMBIL SEMUA PESAN DARI SESSION DAN MENGEMBALIKANNYA SEBAGAI SEBUAH OBJEK YANG DAPAT DIAKSES
    res.locals.messages = req.flash()
    next()
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');


app.use('/', indexRouter);
app.use('/user', mustLogin, usersRouter);
app.use('/auth', mustNotLogin, authRouter);
app.use('/admin', ensureAdmin, mustLogin, adminRouter);

var { roles } = require('./utils/roles')

function ensureAdmin(req, res, next){
    if(req.user.role === roles.admin){
        next();
    }else{
        req.flash('warning', 'you are not Authorized to see this route')
        res.redirect('/')
    }
}

function ensureModerator(req, res, next){
    if(req.user.role === roles.moderator){
        next();
    }else{
        req.flash('warning', 'you are not Authorized to see this route')
        res.redirect('/')
    }
}

module.exports = app;