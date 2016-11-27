'use strict';

/**
 * @ngdoc function
 * @name biblotecaApp.controller:MainCtrl
 * @Author Juan Manuel López Bedoya (juanma0474@hotmail.com)
 * @description
 * # MainCtrl : Trae de la BD las funcionalidades por medio de SOCKET y http real time
 * Controller of the biblotecaApp
 */
 angular.module('biblotecaApp')
 .controller('MainCtrl', function ($scope, $http, socket, $alert, funcionalidad) {


    socket.forward('news', $scope);
    $scope.$on('news', function (ev, data) {
 		$scope.objetos = data;
 	});
 	
 	
 	funcionalidad.getHttpFuncionalidades().success(function(data){
 		$scope.objetos = data;
 		$("[data-toggle=tooltip]").tooltip('show');
 	})
 	.error(function(data){
 		console.log('Error: ' + data.err);
 	});


 	$scope.min = function(){

 		$scope.modal = this.objeto;
 		$('#myModal').modal('toggle');
 	};

 	/*notificacion de los usaurios que se conectan*/
	socket.on('funcionNotify', function (data){

		$alert({
	      content: data,
	      animation: 'fadeZoomFadeDown',
	      type: 'info',
	      placement: 'top-right',
	      duration: 5
	    });
	});



});
