'use strict';

/**
 * @ngdoc function
 * @name biblotecaApp.controller:AdminCtrl
 * @Author Juan Manuel López Bedoya (juanma0474@hotmail.com)
 * @description
 * # AdminCtrl : Controlador para la configuracion del admin
 * Controller of the biblotecaApp
 */
 angular.module('biblotecaApp')
 .controller('AdminCtrl', function ($scope, $http, funcionalidad, socket, $filter, ngTableParams) {

    //Admin User Controller (login, logout)
    var accion = null;
    $scope.objetos = [];
    socket.forward('news', $scope);
        $scope.$on('news', function (ev, data) {
            $scope.objetos = data;
            $scope.tableParams.reload();
     });


    funcionalidad.getHttpFuncionalidades().success(function(data){
 		$scope.objetos = {};
        $scope.objetos = data;
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                fecha_registro: 'desc'     // initial sorting
            }
        }, {
            total: $scope.objetos.length, // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ? $filter('orderBy')($scope.objetos, params.orderBy()) : $scope.objetos;

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

 	})
 	.error(function(data){
 		console.log('Error: ' + data.err);
 	});

    funcionalidad.tipoObjetos().success(function(data){
            $scope.selects = data;
     });


    $scope.editarModal = function () {

    	$scope.formTitulo = "Editar Funcionalidad";
    	$scope.button = "Editar funcionalidad";
    	accion = 2;
        $scope.formData = {};
        $scope.formData.id_fun = this.objeto._id;
        $scope.formData.titles = this.objeto.titulo;
        $scope.formData.descripcion = this.objeto.descripcion;
        $scope.formData.combo = this.objeto.tipo_objetos._id;
    	$('#myModal').modal('toggle');
    };

    $scope.registrarModal = function(){
        $scope.loginForm.$setPristine();
    	$scope.formData = {};
    	$scope.formTitulo = "Registrar Funcionalidad";
    	$scope.button = "Registrar funcionalidad";
    	accion = 1;

    	$('#myModal').modal('toggle');
    }

    $scope.eliminarFuncionalidad = function(){
    	var id =  this.objeto._id;
    	 BootstrapDialog.show({
            title: 'Eliminar funcionalidad',
            message: '¿Estás seguro de que quieres eliminar esta funcionalidad?',
            closable: true,
            closeByBackdrop: false,
            closeByKeyboard: false,
            buttons: [
            {
            	label: 'Cancelar',
                action: function(dialogRef){
                    dialogRef.close();
                }
            },
            {
                label: 'Eliminar funcionalidad',
                cssClass: 'btn-primary',
                action: function(dialogRef){
                    funcionalidad.removeFuncionalidad(id);
                    dialogRef.close();
                }
            }]
        });

    }

    $scope.accion = function (){
    	if(accion == 1){
    		/*crear*/
    		funcionalidad.saveFuncionalidad($scope.formData, function (resp){
                if(resp == true)
                    $scope.formData = {};
                    $scope.loginForm.$setPristine();
            });

    	}else{
    		/*editar*/
    		funcionalidad.updateFuncionalidad($scope.formData);
    	}
    };



});
