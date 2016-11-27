'use strict';

/**
 * @ngdoc function
 * @name biblotecaApp.controller:EditCtrl
 * @Author Juan Manuel López Bedoya (juanma0474@hotmail.com)
 * @description
 * # EditCtrl : Controlador que permite editar las funcionalidades
 * Controller of the biblotecaApp
 */
 angular.module('biblotecaApp')
 .controller('EditCtrl', function ($scope, $routeParams, $rootScope, funcionalidad) {


 	$scope.formData = {};

  var id = $routeParams.id;
  var editData = {};
  $scope.formData = {};
  $scope.selects = {};

  	/**
  	 *Peticion get cuando cargue la vista para capturar
  	 *los tipos de funcionalidades existentes
  	 */
  	funcionalidad.tipoObjetos().success(function(data){
        $scope.selects = data;
    });

    /*Se trae los datos de la funcionalidad a editar*/
    funcionalidad.getFuncionalidad(id).success(function(data){
        $scope.formData.id_fun =  data[0]._id;
        $scope.formData.titles = data[0].titulo;
        $scope.formData.descripcion = data[0].descripcion;
        $scope.formData.combo = data[0].tipo_objetos._id;
         $("body").removeClass("modal-open");
    });


    /*Accion para almacenar la funcionalidad*/
    $scope.update = function(){
      funcionalidad.updateFuncionalidad($scope.formData);
      $scope.loginForm.$setPristine();
    };

    $scope.pageClass = 'fadeZoom';
  });
