/**
 * @ngdoc function
 * @name biblotecaApp.controller:ChatCtrl
 * @Author Juan Manuel López Bedoya (juanma0474@hotmail.com)
 * @description
 * # ChatCtrl : Controlador que permite que los usaurios interactuen mediante un chat.
 * Controller of the biblotecaApp
 */
 angular.module('biblotecaApp')
 .controller('ChatCtrl', function ($scope, socket, $alert, $http, requestService, $rootScope, $window) {

 	/*Se valida si el usaurio se encuentra logueado para usar el chat*/

 	$('.nav-tabs a').click(function (e) {
       e.preventDefault();
       $(this).tab('show');
   });


    $scope.validarChat = function(){

  
          requestService.check();

          if(requestService.isLogged){

            var lista = [];
            var usuario = requestService.user;
            $rootScope.userIn = usuario;
            user();

            /*se capturan los usuarios que estan conectados*/
            socket.on('nicknames', function (data){
               $scope.conectados = data;
           });

            /*notificacion de los usaurios que se conectan*/
 			// socket.on('userNotify', function (data){

 			// 	$alert({
    //               content: data,
    //               animation: 'am-fade-and-slide-top',
    //               type: 'info',
    //               placement: 'top-right',
    //               duration: 3
    //             });
 			// });

            /*captura los Mensajes que fueron enviados por los usuarios*/
            socket.on('users message', function (data){

               lista.push(data);
               $scope.listMessage = lista;
               $scope.classConect = 'reducir';

            });

            /*captura el mensaje del usuario logueado*/
            socket.on('user message', function (data){

               lista.push(data);
               $scope.listMessage = lista;

            });

            /*Enviaa los mensajes a los demas usaurios*/
            $scope.send = function(){

               if($scope.message != ""){
                  socket.emit('user message', $scope.message);
                  socket.emit('users message', $scope.message);
                  $scope.message = "";
              }	
            };

            $scope.removeClass = function(){
               $scope.classConect = '';
            };

            /*Captura el usuario que se logueo*/
            function user(){

               var person  = usuario.name+" - ("+usuario.username+")";
               socket.emit("nickname", person);

               return false;
            }
        
    }
}
});
