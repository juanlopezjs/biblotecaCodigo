/**
 * @mongo_database
 * @Author Juan Manuel López Bedoya (juanma0474@hotmail.com)
 * @description
 * # Logica para crear los esquemas y modelos 
 * # de las colecciones que requiere bibloteca de codigo.
 */

/*Se agrega driver para conectarse a mongoo*/
var mongoose = require('mongoose');
/*Libreria para encriptar las contraseñas*/
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;
var config = require('./config.json');
/*Conexion con la bd*/
var mongodbURL = config.database.connectionString;
//var connectionString = "postgres://"+config.postgres.user+":"+config.postgres.password+"@"+config.postgres.host+"/"+config.postgres.db;

var mongodbOptions = { };

/*Metodo de conexion*/
mongoose.connect(mongodbURL, mongodbOptions, function (err, res) {
    if (err) { 
        console.log('Connection refused to ' + mongodbURL);
        console.log(err);
    } else {
        console.log('Connection successful to: ' + mongodbURL);
    }
});


/*
*@Schema User
*@description : Esquema del modelo usaurio
*/
var UserSchema = new mongoose.Schema({
    nombres : {
        type : String, 
        required : true
    },
    apellidos : {
        type : String, 
        required : true
    },
    username : {
        type : String, 
        required : true,
        lowercase: true, 
        trim : true, 
        unique : true
    },
    password :  {
        type : String, 
        required : true,
        trim : true,
    },
    created : {
        type : Date, 
        default : Date.now
    },
    email : {
        type : String, 
        required : true
    },
    isAdmin : {
        type : String, 
        default : '0',
    },
    estado :{
        type : String,
        default : '1'
    }


});

/*
*@function pre save
*@description : Metodo para encriptar la contraseña antes de almacenar el usaurio.
*/
UserSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});
});



/*
*@function de UserSchema comparePassword
*@description : Metodo para encriptar la contraseña antes de almacenar el usuario.
*/
UserSchema.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(isMatch);
    });
};

/*~~MODELOS~~*/

/*Modelo del usaurio con la estructura definida*/
var User = mongoose.model('users', UserSchema);

/*Modelo de Bibloteca o funcionalidades con la estructura definida*/
var Bibloteca = mongoose.model('objetos', new mongoose.Schema({
    titulo : {
        type : String, 
        required : true
    },
    descripcion : {
        type : String, 
        required : true
    },
    fecha_registro : { type: Date, default : Date.now},
    tipo_objetos :   { type : mongoose.Schema.Types.ObjectId, ref : 'tipo_objetos', required : true },
    users : { type : mongoose.Schema.Types.ObjectId, ref : 'users', required : true} 
}));

/*Modelo de tipo de obejtos o tipo de funcionalidad con la estructura definida*/
var tiposObjetos = mongoose.model('tipo_objetos',new mongoose.Schema({
    nombre : {
        type : String, 
        required : true
    },
    imagen : {
        type : String, 
        required : true
    },
    estado : {type : String, default : '1'}
}));


// Exportar Modelos para utilizarlos en el server.js
exports.User = User;
exports.Bibloteca = Bibloteca;
exports.tiposObjetos = tiposObjetos;