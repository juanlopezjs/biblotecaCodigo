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
 .controller('TipoCtrl', function ($scope, $http, funcionalidad, socket, $filter, ngTableParams, $alert) {

    //Admin User Controller (login, logout)
    var accion = null;
    $scope.objetos = [];
    socket.forward('news', $scope);
    $scope.$on('news', function (ev, data) {
        $scope.objetos = data;
        $scope.tableParams.reload();
    });

    funcionalidad.allTipoObjetos().success(function(data){
        $scope.selects = data;
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                fecha_registro: 'nombre'     // initial sorting
            }
        }, {
            total: $scope.selects.length, // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ? $filter('orderBy')($scope.selects, params.orderBy()) : $scope.selects;

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });


    $scope.editarModal = function () {
        
        $scope.formData = {};
    	$scope.formTitulo = "Editar Tipo de Funcionalidad";
    	$scope.button = "Editar tipo";
    	accion = 2;

        $scope.formData.idImg = this.objeto._id;
    	$scope.formData.nombreTipo = this.objeto.nombre;
        $scope.formData.img = this.objeto.imagen;
        $scope.formData.estado = this.objeto.estados;

    	$('#myModal').modal('toggle');
    };

    $scope.registrarModal = function(){

        $scope.loginForm.$setPristine();
    	$scope.formData = {};
        $('#img').removeAttr( "src");
    	$scope.formTitulo = "Registrar Tipo de Funcionalidad";
    	$scope.button = "Registrar tipo";
    	accion = 1;
    	$('#myModal').modal('toggle');
    }

    $scope.eliminarFuncionalidad = function(){
    	var id =  this.objeto._id;
      BootstrapDialog.show({
        title: 'Eliminar tipo de funcionalidad',
        message: '¿Estás seguro de que quieres eliminar este tipo de funcionalidad?',
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
        label: 'Eliminar tipo',
        cssClass: 'btn-primary',
        action: function(dialogRef){

          $http({
                method :"POST",
                skipAuthorization : true,
                url :'/api/remove/tipo', 
                data : {idImg : id}
            }).success(function(data){

                if(data.tipo != null){
                    $scope.selects = data.tipo;
                    $scope.tableParams.reload();
                    $scope.formData = {};
                }

                $alert({
                    content: data.msg,
                    animation: 'fadeZoomFadeDown',
                    type: data.type,
                    placement: 'top-right',
                    duration: 5
                });
            });

            dialogRef.close();
        }
    }]
});
    	//funcionalidad.removeFuncionalidad(id);
    }

    $scope.accion = function (){

        $scope.loginForm.$setPristine();
    	if(accion == 1){
    		/*crear*/ 
            $http({
                method :"POST",
                skipAuthorization : true,
                url :'/api/save/tipo', 
                data : $scope.formData
            }).success(function(data){

                if(data.tipo != null){
                    $scope.selects = data.tipo;
                    $scope.tableParams.reload();
                    $scope.formData = {};
                    $scope.formData.img = " ";
                }

                $alert({
                    content: data.msg,
                    animation: 'fadeZoomFadeDown',
                    type: data.type,
                    placement: 'top-right',
                    duration: 5
                });
                
            });

    	}else{
    		/*editar*/
            $http({
                method :"POST",
                skipAuthorization : true,
                url :'/api/update/tipo', 
                data : $scope.formData
            }).success(function(data){
                console.log(data);
                if(data.tipo != null){
                    $scope.selects = data.tipo;
                    $scope.tableParams.reload();
                }

                $alert({
                    content: data.msg,
                    animation: 'fadeZoomFadeDown',
                    type: data.type,
                    placement: 'top-right',
                    duration: 5
                });
            });
    	}
    };

    function readImage(input) {

        if ( input.files && input.files[0] ) {  
            var FR= new FileReader();
            var image = new Image();
            if(!(/\.(jpg|png|gif|jpeg)$/i).test(input.files[0].name)){

                 $('#img').attr( "src","");
                 $("#pImg").css("display","none");

                BootstrapDialog.show({
                                title: 'Advertencia',
                                message: 'El archivo no tiene formato de una imagen.',
                                type : BootstrapDialog.TYPE_WARNING,
                                closable: true,
                                buttons: [
                                {
                                   label: 'Aceptar',
                                   cssClass: 'btn-warning',
                                    action: function(dialogRef){
                                        dialogRef.close();
                                    }   
                                }]
                            });
            }else{
                FR.onload = function(e) {
                    image.src = e.target.result;

                        if(image.height == 64 && image.width == 64 ){
                          $("#pImg").css("display","block");  
                          $('#img').attr( "src", image.src );
                          $scope.formData.img = e.target.result;
                        }else{
                         $('#img').attr( "src","");
                         $("#pImg").css("display","none");

                            BootstrapDialog.show({
                                title: 'Advertencia',
                                message: 'El tamaño de la imagen debe ser 64 x 64 pixeles.',
                                type : BootstrapDialog.TYPE_WARNING,
                                closable: true,
                                closeByBackdrop: false,
                                closeByKeyboard: false,
                                buttons: [
                                {
                                   label: 'Aceptar',
                                   cssClass: 'btn-warning',
                                    action: function(dialogRef){
                                        dialogRef.close();
                                    }   
                                }]
                            });
                        }
                };       
                FR.readAsDataURL( input.files[0] );
            }
         }
     }

     $("#imgFile").change(function(){
        readImage( this );
    });

     $scope.limpiar = function (){
        $scope.formData = {};
     }



 });