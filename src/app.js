const express =require('express'); // Microframework de backend
const helmet=require('helmet'); // paquete de seguridad para ocultar información de la app
const morgan =require('morgan');//
const cors =require('cors');
const rateLimit = require("express-rate-limit");


const app =express(); //incializa el framework

// Configuraciones
/*const apiLimiter = rateLimit({ // Limite de peticiones a una ruta
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // Conexiones maximas 1000
  });*/

//app.set('trust proxy', 1); // trabaja en conjunto con el limite de peticiones a las ruta
//app.use(apiLimiter); // Limita conexiones
app.set('port',process.env.PORT || 4094 ); // comunication port
app.use(helmet()); //ayuda a proteger la aplicación de algunas vulnerabilidades web conocidas mediante el establecimiento correcto de cabeceras HTTP.
const whiteList=['http:localhost:4094','http:localhost:3000','http:localhost:4000','http:localhost:4001', 'https://carapi.app','http://carapi.app', 'https://repuestosgo.com', 'http://repuestosgo.com', 'https://bk.repuestosgo.com']
// Middleware
app.use(cors());
app.use(morgan('dev')); // transaction views in  'dev'  format
app.use(express.urlencoded({extended:false,limit: '100mb'})); // Esto es para pode recibir datos enviados -2000kb
app.use(express.json({limit: '100mb'})); // for read .JSON format

// Routes
app.use(require('./routes/account.route'));
app.use(require('./routes/autentication.route'));
app.use(require('./routes/admin.route'));
app.use(require('./routes/module.route'));
app.use(require('./routes/subModule.route'));
app.use(require('./routes/roles.route'));
app.use(require('./routes/panel.route'));
app.use(require('./routes/permission.route'));
app.use(require('./routes/grantRoles.route'));
app.use(require('./routes/departament.route'));
app.use(require('./routes/employeefile.route'));
app.use(require('./routes/membership.route'));
app.use(require('./routes/generals.route'));
app.use(require('./routes/appointmet.route'));
app.use(require('./routes/medicalReport.route'));
app.use(require('./routes/inventory.route'));
app.use(require('./routes/fixer.route'));
app.use(require('./routes/patient.route'));
app.use(require('./routes/voucher.route'));
app.use(require('./routes/changeType.route'));
app.use(require('./routes/reports.route'));
app.use(require('./routes/store.route'));
app.use(require('./routes/categories.route'));
app.use(require('./routes/publishing.route'));
app.use(require('./routes/shoppingCar.route'))

app.listen(app.get('port'),function(){
    console.log('repuestosGO is working in port:', app.get('port'));

})