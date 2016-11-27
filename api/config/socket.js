function Socket(io,db){

	var nicknames = [];

	io.sockets.on('connection', function (socket) {

		socket.on('nickname', function (data){
			nickname(data,socket);
		});

		socket.on('create', function (data, idUser, fn) {
			crearFuncionalidad(data, socket, idUser, fn);
		});

		socket.on('disconnect', function (){
			disconnect(socket);
		});

		socket.on("users message", function (data){
			newMessage(data,socket);
		});

		socket.on("user message", function (data){
			myNewMessage(data,socket);
		});

		socket.on('update', function (data, idUser, fn){
			editarFuncionalidad(data, socket, idUser, fn);
		});

		socket.on('remove', function (id, fn){
			
			eliminarFuncionalidad(id, socket, fn);
		});
		

	});


	function crearFuncionalidad(data, socket, id, fn){

		db.Bibloteca.find({titulo : data.titles}, function (err, funcionalidad){	
		if (err) {
	 			return fn({
	 				msg : "Error obteniendo funcionalidad ", type : 'danger'
	 			});
	 		}
	 		if(funcionalidad.length == 0){	
				var funcionalidad = new db.Bibloteca({ titulo : data.titles, descripcion : data.descripcion, tipo_objetos :data.combo, users : id});
				funcionalidad.save(function(err){
					if(err)
						fn({msg : 'Error al registrar la funcionalidad. ', type : 'danger'});
					getFuncionalidades();
					socket.broadcast.emit("funcionNotify", "Se ha creado la funcionalidad "+ data.titles + ".");

					 fn({msg : 'Se almaceno la funcionalidad satisfactoriamente.', type : 'success'});
				});
			}else{
				fn({msg : 'Ya existe una funcionalidad con este titulo.', type : 'danger'});
			}
		});	
	}

	function editarFuncionalidad(data, socket, idUser, fn){
		
		db.Bibloteca.update({_id : data.id_fun}, {
		  	titulo : data.titles,
		  	descripcion : data.descripcion,
		  	tipo_objetos : data.combo,
		  	users : idUser
		  }, {upsert: true}, function(err, num, n){
		  	
    		if(err){
         		fn({msg : 'Error al editar la funcionalidad.', type : 'danger'});
      		}else{ 
      			getFuncionalidades();
         		fn({msg :'Se edito la funcionalidad exitosamente.', type : 'success'});
         		getFuncionalidades();
				socket.broadcast.emit("funcionNotify", "Se ha editado la funcionalidad "+ data.titles + ".");
      		}
		});


	}

	function eliminarFuncionalidad(id, socket, fn){
		db.Bibloteca.remove({_id: id}, function(error){
			 if(error){
         		fn({msg : 'Error al intentar eliminar la funcionalidad.', type : 'danger'});
      		}else{ 
      			getFuncionalidades();
         		fn({msg :'Se elimino la funcionalidad satisfactoriamente.', type : 'success'});
      		}
		});
	}

	function getFuncionalidades(){

		db.Bibloteca.find().populate('tipo_objetos').populate('users').sort([['fecha_registro', 'descending']]).exec(function(err, bibloteca){
			if(err){
				io.emit('news', { error: err });
			}
			io.emit('news', bibloteca);
		});
	}

	function nickname(data, socket){

			socket.nickname = data;
			if(nicknames.indexOf(data) == -1){
				nicknames.push(data);
				//socket.broadcast.emit("userNotify", "Se ha conectado "+ socket.nickname + ". ");
			}
			
			io.emit('nicknames', nicknames);
			console.log("nicknames son : " + nicknames);
	}

	function newMessage(data,socket){


		socket.broadcast.emit('users message', {
			nick    : socket.nickname,
			message : data
		});
	}

	function myNewMessage(data,socket){
		socket.emit('user message', {
			nick    : socket.nickname,
			message : data
		});
	}

	function disconnect(socket){
		if(!socket.nickname) return;
		if(nicknames.indexOf(socket.nickname) > -1){
			nicknames.splice(nicknames.indexOf(socket.nickname), 1);
		}
		io.emit('nicknames', nicknames);
		console.log("nicknames son : " + nicknames);
	}

}

module.exports.Socket = Socket;

