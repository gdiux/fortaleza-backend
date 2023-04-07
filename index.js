//Env
require('dotenv').config();
const compress = require('compression');
const path = require('path');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const robots = require('express-robots-txt');

const zip = require('express-easy-zip');

//Conection DB
const { dbConection } = require('./database/config');


// Crear el servidor express
const app = express();

// COMPRESS
app.use(compress());

// CORS
app.use(cors());

//app.use(express.bodyParser({ limit: '50mb' }));
// READ BODY
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));

// ROBOT TXT
app.use(robots({
    UserAgent: '*',
    Sitemap: 'https://grupofortalezasas.com/assets/sitemap.xml',
}));

app.use(zip());


// DataBase
dbConection();

// DIRECTORIO PUBLICO
app.use(express.static('public'));

// RUTAS
app.use('/api/bussiness', require('./router/bussiness.route'));
app.use('/api/entrevistas', require('./router/entrevista.route'));
app.use('/api/jobs', require('./router/jobs.route'));
app.use('/api/login', require('./router/auth.route'));
app.use('/api/worker', require('./router/worker.route'));

app.use('/api/uploads', require('./router/uploads.route'));

// SPA
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.listen(process.env.PORT, () => {
    console.log('Servidor Corriendo en el Puerto', process.env.PORT);
});