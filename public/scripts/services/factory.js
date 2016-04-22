angular.module('biblotecaApp')
.factory('socket', function (socketFactory) {

	/*Servicio donde se inicializa el socket*/

	return socketFactory({
		prefix: '',
		ioSocket: io()
	});
})
.factory('funcionalidad', function ($http, requestService, socket, $alert ) {


	var edit = {
		tipoObjetos : function(){

			return $http.get('/api/tiposObjetos');
		},
		allTipoObjetos : function(){
			return $http.get('/api/allTiposObjetos');
		},
		getFuncionalidad : function (id){

			return $http.get('/api/bibloteca/'+id);
		},
		saveFuncionalidad : function(forma, fn){
			requestService.check();
      		if(requestService.isLogged){
          		socket.emit('create', forma , requestService.user.id, function(resp){

          			if(resp.type == 'success'){
          				fn(true);
          			}

          			$alert({
							content: resp.msg,
							animation: 'fadeZoomFadeDown',
							type: resp.type,
							placement: 'top-right',
							duration: 5
						});
          		});
      		}
		},
		getHttpFuncionalidades : function(){
			return $http.get('/api/bibloteca/');
		},
		removeFuncionalidad : function(id){
			requestService.check();
      		if(requestService.isLogged){
          		socket.emit('remove', id, function (data){
          			$alert({
							content: data.msg,
							animation: 'fadeZoomFadeDown',
							type: data.type,
							placement: 'top-right',
							duration: 5
						});
          		});

      		}
		},
		updateFuncionalidad : function(forma){
			requestService.check();

			if(requestService.isLogged){
				socket.emit('update', forma, requestService.user.id, function (data){
					$alert({
							content: data.msg,
							animation: 'fadeZoomFadeDown',
							type: data.type,
							placement: 'top-right',
							duration: 5
						});

				});

			}
		}
	}
	return edit;

});