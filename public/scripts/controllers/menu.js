'use strict';

/**
 * @ngdoc function
 * @name biblotecaApp.controller:MenuCtrl
 * @Author Juan Manuel López Bedoya (juanma0474@hotmail.com)
 * @description
 * # MenuCtrl
 * Controller of the biblotecaApp
 * 
 */
 angular.module('biblotecaApp')
 .controller('MenuCtrl', function ($scope, $rootScope, requestService, $window, $location, loginService, $templateCache) {

    $('.dropdown-toggle').dropdown();

 	/*Se valida si un usaurio ya se encuentra logueado para capturar su informacion*/
 	requestService.check();
 	var usuario = null;
 	if(requestService.isLogged){
		 usuario = requestService.user;
	}

	$rootScope.userIn = usuario;

	/*evento click para salir del programa (cerrar sesion)*/
	 $scope.logout = function() {

        loginService.logout().then(function(result){
  
                delete $window.localStorage.token;
                $window.localStorage.clear();
                delete $window.localStorage.user;
                $rootScope.userIn = "";
                $location.path("/login");
        });
    }

    /*Evento click para mostrar en pantalla ACERCA DE*/
    $scope.acerca = function(){

         BootstrapDialog.show({
            title: 'Acerca de Bibloteca de Código',
            message:  html()
        });

         return false;
    }

    function html(){
        var date = new Date();
        var  html =  '<div class="text-center">';
             html += '<h3>Bibloteca de Código</h3>';
             html += '<p class="text-muted">Versión 1.0</p>';
             html += '<p class="text-muted">Copyright  &copy; '+date.getFullYear()+'.</p>';
             html += '<p class="text-muted">Autor: Juan Manuel López</p>';
             html += '<p class="text-muted">Email: juanma0474@hotmail.com</p>';
             html += '<p class="text-muted">Todos los derechos reservados.</p>';
             html += '</div>';

        return html;
    }

});
