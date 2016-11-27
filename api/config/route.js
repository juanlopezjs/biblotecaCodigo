/**
 * @function route
 * @name biblotecaApp api route
 * @Author Juan Manuel López Bedoya (juanma0474@hotmail.com)
 * @description
 * # route : Routing al lado del servidor
 * Routing of the biblotecaApp
 */

 function route(app, jwt, db){

	/*
	 *@function auth
	 *@description : Captura el token del cliente y lo valida con el token del servidor
	 *				 Para permitirle acceso a la informacion
	 */

	 var mySecretKey = "34Dy67DL03dAQpdek";


	 function auth(req, res, next) {

	 	var token;
	 	/*se valida si las cabeceras tienen el token*/
    console.log(req.param('token'));
	 	if (req.headers && req.headers.authorization) {
	 		var parts = req.headers.authorization.split(' ');
	 		if (parts.length === 2) {
	 			var scheme = parts[0],
	 			credentials = parts[1];

	 			if (/^Bearer$/i.test(scheme)) {
	 				token = credentials.replace(/"/g, "");
          console.log("juanma "+token);
	 			}
	 		} else {
	 			return res.json(401, {err: 'El formato de autorizacion es: Bearer [token]'});
	 		}
	 	}else if (req.param('token')) {
	 		token = req.param('token');
	 		delete req.query.token;
	 	} else {
	 		return res.json(401, {err: 'No se encontro la autorizacion'});
	 	}

	 	/*Si todo esta bien se verifica el token del cliente con el del servidor*/
	 	return jwt.verify(token, mySecretKey, {}, function(err, decoded) {
      console.log("verify "+token);
	 		if (err) return res.json(401, {err: 'El token no es valido'});

	 		req.token = decoded;
	 		next();
	 	});
	 }

	/*
	 *@Routing  api /api/bibloteca
	 *@param    auth : Verifica antes de hacer la peticion si existen un token
	 *@Method   GET
	 *@description : Retornamos todas las funcionalidades que se encuentre en mongoo
	 */
	 app.get('/api/bibloteca',auth, function (req, res){
	 	/*Se busca en moongo las funcionaldiades. Relacionando los modelos de tipo de objetos y el de usuarios*/
	 	db.Bibloteca.find().populate('tipo_objetos').populate('users')
	 	.sort([['fecha_registro', 'descending']]).exec(function(err, bibloteca){
	 		if(err){
	 			res.send(err);
	 		}
	 		res.json(bibloteca);
	 	});
	 });

	 /*Retornamos todo lo que se encuentre en mongoo*/
	 app.get('/api/bibloteca/:id', auth, function (req, res){
	 	db.Bibloteca.find({_id : req.params.id}).populate('tipo_objetos').exec(function (err, bibloteca){
	 		if(err){
	 			res.send(err);
	 		}
	 		res.json(bibloteca);
	 	});
	 });

	/*
	 *@Routing  api /api/bibloteca
	 *@param    auth : Verifica antes de hacer la peticion si existen un token
	 *@Method   POST
	 *@description : POST que crea un nuevo objeto y devuelve todas las funcionalidades
	 */
	 app.post('/api/bibloteca', auth, function (req, res){
	 	db.Bibloteca.create({
	 		titulo: req.body.titles,
	 		descripcion : req.body.descripcion
	 	}, function (err, objeto){
	 		if(err){
	 			res.send(err);
	 		}

	 		db.Bibloteca.find().populate('tipo_objetos').populate('users').exec(function(err, bibloteca){
	 			if(err){
	 				res.send(err);
	 			}
	 			res.json(bibloteca);
	 		});
	 	});
	 });

	/*
	 *@Routing  api /api/tiposObjetos
	 *@param    auth : Verifica antes de hacer la peticion si existen un token
	 *@Method   GET
	 *@description : Devuelve los tipos de objetos
	 */
	 app.get('/api/tiposObjetos', auth, function (req, res){
	 	db.tiposObjetos.find({estado : '1'}, function(err, tipo){
	 		if(err){
	 			res.send(err);
	 		}
	 		res.json(tipo);
	 	});
	 });


	 	/*
	 *@Routing  api /api/tiposObjetos
	 *@param    auth : Verifica antes de hacer la peticion si existen un token
	 *@Method   GET
	 *@description : Devuelve los tipos de objetos
	 */
	 app.get('/api/allTiposObjetos', auth, function (req, res){
	 	getAllTiposObjetos(function(resp){
	 		if(resp.msg == null){
	 			res.json(resp.tipo);
	 		}
	 	});
	 });

	 function getAllTiposObjetos(fn){
	 	db.tiposObjetos.find(function(err, tipo){
	 		if(err){
	 			fn({msg : err});
	 		}
	 		fn({tipo : tipo});
	 	});
	 }

 	/*
	 *@Routing  api /api/update/tipo
	 *@param    auth : Verifica antes de hacer la peticion si existen un token
	 *@Method   POST
	 *@description : Actualiza los tipo de funcionalidad
	 */
	 app.post('/api/update/tipo', auth, function (req, res){

	 	db.tiposObjetos.update({_id : req.body.idImg}, {
	 		nombre : req.body.nombreTipo,
	 		imagen : req.body.img,
	 		estado : req.body.estado
	 	}, {upsert: true}, function(err, num, n){
	 		if(err){
	 			res.json({msg : "Error al actualizar la informacion del tipo de funcionalidad.", type : "danger"});
	 			throw err;
	 		}else{
	 			getAllTiposObjetos(function(resp){
	 				res.json({tipo : resp.tipo, msg : "Se actualizó satisfactoriamente la informacion del tipo de funcionalidad.", type : "success"});
	 			});
	 		}
	 	});

	 });

	 /*
	 *@Routing  api /api/remove/users
	 *@param    auth : Verifica antes de hacer la peticion si existen un token
	 *@Method   POST
	 *@description : Elimina un tipo de funcionalidad
	 */
	 app.post('/api/remove/tipo', auth, function (req, res){

	 	db.tiposObjetos.remove({_id: req.body.idImg}, function(error){

	 		if(error){
	 			res.json({msg : 'Error al eliminar el tipo de funcionalidad.', type : "danger"});
	 		}else{
	 			getAllTiposObjetos(function(resp){
	 				res.json({msg : 'Se elimino el tipo de funcionalidad satisfactoriamente.', tipo : resp.tipo, type : "success"});
	 			});
	 		}
	 	});
	 });


	 /*
	 *@Routing  api /api/save/tipo
	 *@param    auth : Verifica antes de hacer la peticion si existen un token
	 *@Method   POST
	 *@description : Almacena tipo de funcionalidad
	 */
	 app.post('/api/save/tipo', auth, function (req, res){

	 	db.tiposObjetos.find({nombre : req.body.nombreTipo}, function (err, tipo){

	 		if (err) {
	 			return res.json({
	 				msg : "Error obteniendo el tipo de funcionalidad ", type : "danger"
	 			});
	 		}
	 		if(tipo.length == 0){
	 			var tipoFuncionalidad = new db.tiposObjetos({nombre : req.body.nombreTipo,
	 				imagen : req.body.img,
	 			});

	 			tipoFuncionalidad.save(function(err){
	 				if(err){
	 					res.json({msg : 'Error al registrar el tipo de funcionalidad.', type : "danger"});
	 				}else{

	 					getAllTiposObjetos(function(resp){
	 						if(resp.msg == null){
	 							res.json({msg : 'Se registro el tipo de funcionalidad satisfactoriamente.', tipo : resp.tipo, type : "success"});
	 						}
	 					});

	 				}
	 			});
	 		}else{
	 			res.json({msg : 'Este tipo de funcionalidad ya existe.', type : "danger"});
	 		}
	 	});
	 });


	/*
	 *@Routing  api /api/users
	 *@param    auth : Verifica antes de hacer la peticion si existen un token
	 *@Method   GET
	 *@description : Devuelve los usuarios del sistema
	 */
	 app.get('/api/users', auth, function (req, res){

	 	getUsers(function(users){
	 		res.json(users);
	 	});
	 });

	 /**/
	 function getUsers(fn){

	 	db.User.find(function(err, users){
	 		if(err){
	 			res.send(err);
	 		}
	 		fn(users);
	 	});
	 }

	 /*
	 *@Routing  api /api/update/users
	 *@param    auth : Verifica antes de hacer la peticion si existen un token
	 *@Method   POST
	 *@description : Actualiza los datos de un usuario del sistema
	 */
	 app.post('/api/update/user', auth, function (req, res){

	 	db.User.update({_id : req.body.userId}, {
	 		nombres : req.body.nombre,
	 		apellidos : req.body.apellido,
	 		email : req.body.correo,
	 		isAdmin : req.body.isAdmin,
	 		estado : req.body.estado
	 	}, {upsert: true}, function(err, num, n){
	 		if(err){
	 			res.json({msg : "Error al actualizar la informacion del usuario."});
	 			throw err;
	 		}else{
	 			getUsers(function(users){
	 				res.json({users : users, msg : "Se actualizo satisfactoriamente la informacion del usuario."});
	 			});
	 		}
	 	});

	 });

	 /*
	 *@Routing  api /api/remove/users
	 *@param    auth : Verifica antes de hacer la peticion si existen un token
	 *@Method   POST
	 *@description : Elimina un usuario del sistema
	 */
	 app.post('/api/remove/user', auth, function (req, res){

	 	db.User.remove({_id: req.body.id}, function(error){

	 		if(error){
	 			res.json({msg : 'Error al eliminar el usuario.'});
	 		}else{
	 			getUsers(function(users){
	 				res.json({msg : 'Se elimino el usuario satisfactoriamente.', users : users});
	 			});
	 		}
	 	});
	 });

	 /*
	 *@Routing  api /api/save/users
	 *@param    auth : Verifica antes de hacer la peticion si existen un token
	 *@Method   POST
	 *@description : Almacena usuario al sistema
	 */
	 app.post('/api/save/user', auth, function (req, res){

	 	db.User.find({$or :[{username : req.body.usuario}, {email : req.body.correo}]}, function (err, user){

	 		if (err) {
	 			return res.json({
	 				msg : "Error obteniendo usuario "
	 			});
	 		}
	 		if(user.length == 0){
	 			var funcionalidad = new db.User({nombres : req.body.nombre,
	 				apellidos : req.body.apellido,
	 				username : req.body.usuario,
	 				password : req.body.usuario,
	 				email: req.body.correo
	 			});

	 			funcionalidad.save(function(err){
	 				if(err){
	 					res.json({msg : 'Error al registrar el usuario.'});
	 				}else{
	 					getUsers(function(users){
	 						res.json({msg : 'Se registro el usuario satisfactoriamente.', users : users});
	 					});
	 				}
	 			});
	 		}else{
	 			res.json({msg : 'Este usuario ya esxiste.'});
	 		}
	 	});
	 });


	/*
	 *@Routing  api /api/login
	 *@Method   POST
	 *@description : Peticion que valida la existencia del usuario para permitirle el ingreso.
	 */
	 app.post('/api/login', function (req, res, next) {

	 	var msg =  'El nombre de usuario y la contraseña<br>&nbsp;que ingresaste ';
	 	msg += 'no coinciden con nuestros<br>&nbsp;registros. Por favor, ';
	 	msg += 'revisa e inténtalo de nuevo.';

	 	db.User.findOne({username: req.body.username, estado : 1}, function (err, user, count) {
	 		if (err) {
	 			return res.status(500).json({
	 				msg : msg
	 			});
	 		}

	 		if (!user) {
	 			return res.status(404).json({
	 				msg : msg
	 			});
	 		}


	 		if(req.body.password != undefined || req.body.password != null){

	 			user.comparePassword(req.body.password, function(isMatch) {

	 				if (!isMatch) {

	 					return res.status(404).json({
	 						msg : msg
	 					});
	 				}

	 				if(user.isAdmin == '1'){
	 					path = "/admin"
	 				}else{
	 					path = "/"
	 				}

	 				var token = jwt.sign(user._id, mySecretKey, { expiresInMinutes: 20 });

	 				return res.status(200).json({
	 					user:{id: user._id ,name: user.nombres+" "+user.apellidos, username : user.username, email : user.email, path : path, admin : user.isAdmin},
	 					token : token
	 				});

	 			});
	 		}else{
	 			return res.status(404).json({
	 				msg : msg
	 			});
	 		}
	 	});
	 });

	/*
	 *@Routing  api /api/updatePassword
	 *@Method   POST
	 *@description : Peticion para actualizar la contraseña del usuario
	 */
	 app.post('/api/updatePassword',auth, function(req, res){


	 	db.User.findOne({username: req.body.username}, function (err, user, count) {

	 		if (err) {
	 			return res.status(500).json({
	 				msg : 'Error al validar los datos del usuario.', type : "danger"
	 			});
	 		}

	 		if (!user) {
	 			return res.status(404).json({
	 				msg : 'Este usuario no existe.', type : "danger"
	 			});
	 		}


	 		if(req.body.oldPassword != undefined || req.body.oldPassword != null){


	 			user.comparePassword(req.body.oldPassword, function(isMatch) {

	 				if (!isMatch) {

	 					return res.json({
	 						msg : 'La contraseña anterior que ha escrito no coincide con la actual.', type : "danger"
	 					});
	 				}else if(req.body.password != req.body.newPassword){

	 					return res.json({
	 						msg : 'Las contraseñas no coinciden.', type : "danger"
	 					});
	 				}else if(req.body.newPassword == req.body.oldPassword ){
	 					return res.json({
	 						msg : 'La contraseña no puede ser igual que la anterior.', type : "danger"
	 					});
	 				}

	 				user.password = req.body.newPassword;

	 				user.save(function (err){
	 					if(err){
	 						return res.json({msg : "Error al actualizar su contraseña.", type : "danger"});

	 					}else{
	 						return res.json({ msg : "Se actualizó satisfactoriamente su contraseña.",  type : "success"});
	 					}
	 				});

	 			});
	 		}else{
	 			return res.json({
	 				msg : 'Debe ingresar la contraseña ', type : "danger"
	 			});
	 		}
	 	});
	});

	/*
	 *@Routing  api /api/logout
	 *@Method   POST
	 *@description : Peticion para cerrar session del usaurio
	 */
	 app.post('/api/logout', function(req, res){
		//req.logOut();
		res.clearCookie("user");
		res.send(200);
	});

	 app.get('*', function(req, res) {
	 	res.redirect('/#' + req.originalUrl);
	 });

	 app.use(function(err, req, res, next) {
	 	console.error(err.stack);
	 	res.send(500, { message: err.message });
	 });
	}

	/*Exporta la logica para utilizarla en el server*/
	module.exports.route = route;
