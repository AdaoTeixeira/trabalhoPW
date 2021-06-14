const express = require('express');
const path = require('path');
const logger = require('morgan');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const cors = require('cors');
const mysql = require('mysql');
const connectionDetails = require('./config/mysql-connection');
const passport = require('./config/passport');
const fileUpload = require('express-fileupload');

const app = express();

const fileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4())
    }
});

const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
  };
  


const hostname = '127.0.0.1';
const port = 3000;

global.connection = mysql.createConnection({
    host: connectionDetails.host,
    port: connectionDetails.port,
    user: connectionDetails.user,
    password: connectionDetails.password,
    database: connectionDetails.database
});

global.connection.connect(function(err) {
  if (err) throw err;
  console.log('You are now connected to MySQL...');
});

app.use('/upload', express.static(path.join(__dirname, 'upload')));
app.use(fileUpload());


app.post('/upload', function(req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});


app.use(cors()); //forçar utilização das bibliotecas
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(validator());
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true })); // application/json
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));


passport.applyTo(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(path.join(__dirname, 'views/partials'));
hbs.registerHelper('isUserOfType', function(type, options) {
    if(options.data.root.user && 
    options.data.root.user.type === type) {
        return options.fn(this);
    }
    return options.inverse(this);
});

//forçar o uso da API em port diferentes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/api/v1/users', require('./routes/api/users'));
app.use('/api/v1/activities', require('./routes/api/activities'));
app.use('/api/v1/events', require('./routes/api/events'));
app.use('/api/v1/sponsors', require('./routes/api/sponsors'));
app.use('/api/v1/members', require('./routes/api/members'));
app.use('/api/v1/activities', require('./routes/api/activities'));
app.use('/api/v1/registrations', require('./routes/api/registrations'));

app.get('/', function(req, res) {
    res.render('index');
});
app.get('/users', global.redirectIfNotLogged('admin'), function(req, res, next) {
    res.render('admin/users');
});
app.get('/activities', global.redirectIfNotLogged(), function(req, res, next) {
    res.render('admin/activities');
});
app.get('/events', global.redirectIfNotLogged('admin'), function(req, res, next) {
    res.render('admin/events');
});
app.get('/members', global.redirectIfNotLogged('admin'), function(req, res, next) {
    res.render('admin/members');
});
app.get('/sponsors', (req, res, next) => {
    res.render('admin/sponsors');
});
app.get('/registrations', global.redirectIfNotLogged('admin'), function(req, res, next) {
    res.render('admin/registrations');
});

app.get('/admin',global.redirectIfNotLogged('admin'), (req, res) => {
    res.render('admin/admin');
});
//rota teste evento
app.get('/eventos', (req, res) => {
    res.render('eventos/evento');
});
//rota teste evento
app.get('/eventos/registo', (req, res) => {
    res.render('eventos/registo');
});



//rota teste
app.get('/patrocinadores/registo', (req, res) => {
    res.render('patrocinadores/registo');
});



app.get('/registo', (req, res) => {res.render('users/newuserform');}); //formulário de novo user





app.use((req, res, next) => {
    res.status(404).render(path.join(__dirname, 'views/partials', '404.hbs'));
  });

app.use((error, req, res, next) => {
  console.log(error);
  let status = error.statusCode || 500;
  let message = error.message;
  res.status(status).json({ message: message });
 });

app.listen(port, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});
