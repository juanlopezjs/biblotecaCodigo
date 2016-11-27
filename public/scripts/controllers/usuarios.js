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
 .controller('UserCtrl', function ($scope, $http, socket, $filter, ngTableParams, $alert) {

    //Admin User Controller (login, logout)
    var accion = null;


    $http.get("/api/users").success(function(data){
        $scope.users = data;
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                created: 'desc'     // initial sorting
            }
        }, {
            total: $scope.users.length, // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });


    $scope.editarModal = function () {

    	$scope.formTitulo = "Editar Usuario";
    	$scope.button = "Editar usuario";
        $scope.formData = {};
    	$scope.formData.nombre =  this.objeto.nombres;
        $scope.formData.apellido =  this.objeto.apellidos
        $scope.formData.correo =  this.objeto.email;
        $scope.formData.usuario =  this.objeto.username;
        $scope.formData.isAdmin = this.objeto.perfil;
        $scope.formData.estado = this.objeto.estados;
        $scope.formData.userId = this.objeto._id;
    	accion = 2;

    	$('#myModal').modal('toggle');
    };

    $scope.registrarModal = function(){

        $scope.loginForm.$setPristine();
    	$scope.formData = {};
    	$scope.formTitulo = "Registrar Usuario";
    	$scope.button = "Registrar usuario";
    	accion = 1;

    	$('#myModal').modal('toggle');
    }

    $scope.eliminarFuncionalidad = function(){
    	var id =  this.objeto._id;
          BootstrapDialog.show({
            title: 'Eliminar usuario',
            message: '¿Estás seguro de que quieres eliminar este usuario?',
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
                label: 'Eliminar usuario',
                cssClass: 'btn-primary',
                action: function(dialogRef){
                  $http({
                        method :"POST",
                        skipAuthorization : true,
                        url :'/api/remove/user', 
                        data : {id : id}
                    }).success(function(data){
                        var type = null, msg = data.msg;

                        if(data.users != null){
                            $scope.users = data.users;
                            $scope.tableParams.reload();
                            type = 'success';
                             $scope.formData = {};
                        }else{
                            type = 'danger';
                        }

                        $alert({
                            content: msg,
                            animation: 'fadeZoomFadeDown',
                            type: type,
                            placement: 'top-right',
                            duration: 5
                        });
                    });

                  dialogRef.close();
                }
            }]
        });
    }

    $scope.accion = function (){

       $scope.loginForm.$setPristine();
       if(accion == 1){
          /*crear*/

          $http({
                method :"POST",
                skipAuthorization : true,
                url :'/api/save/user', 
                data : $scope.formData
            }).success(function(data){
                var type = null, msg = data.msg;

                if(data.users != null){
                    $scope.users = data.users;
                    $scope.tableParams.reload();
                    type = 'success';
                    $scope.formData = {};
                }else{
                    type = 'danger';
                }

                $alert({
                    content: msg,
                    animation: 'fadeZoomFadeDown',
                    type: type,
                    placement: 'top-right',
                    duration: 5
                });
                
            });
        }else{
            /*editar*/
             $http({
                method :"POST",
                skipAuthorization : true,
                url :'/api/update/user', 
                data : $scope.formData
            }).success(function(data){
                var type = null, msg = data.msg;
                if(data.users != null){
                    $scope.users = data.users;
                    $scope.tableParams.reload();
                    type = 'success';
                }else{
                    type = 'danger';
                }

                $alert({
                    content: msg,
                    animation: 'fadeZoomFadeDown',
                    type: type,
                    placement: 'top-right',
                    duration: 5
                });
            });
        }
    };

});