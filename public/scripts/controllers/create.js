'use strict';

/**
 * @ngdoc function
 * @name biblotecaApp.controller:CreateCtrl
 * @Author Juan Manuel López Bedoya (juanma0474@hotmail.com)
 * @description
 * # CreateCtrl : Controlador que permite crear nuevas funcionalidades
 * Controller of the biblotecaApp
 */
 angular.module('biblotecaApp')
 .controller('CreateCtrl', function ($scope, funcionalidad) {

 	  $scope.formData = {};
  	/**
  	 *Peticion get cuando cargue la vista para capturar
  	 *los tipos de funcionalidades existentes
  	 */
     funcionalidad.tipoObjetos().success(function(data){
        $scope.selects = data;
    });

     /*Accion para almacenar la funcionalidad*/
  	$scope.save = function(){

      funcionalidad.saveFuncionalidad($scope.formData, function (resp){
                if(resp == true)
                    $scope.formData = {};
                    $scope.loginForm.$setPristine();    
            });
  	};
});
