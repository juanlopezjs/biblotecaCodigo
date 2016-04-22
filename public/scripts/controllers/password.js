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
 .controller('PasswordCtrl', function ($scope, requestService,loginService,$location,$alert) {

    requestService.check();
    var usuario = null;
    if(requestService.isLogged){
         $scope.formData = {username : requestService.user.username};
    }else{
         $location.path("/login");
    }

	/*evento click para salir del programa (cerrar sesion)*/
	 $scope.changePassword = function() {

        loginService.chagePassword($scope.formData).then(function(result){
  
            $alert({
                  content: result.data.msg,
                  animation: 'fadeZoomFadeDown',
                  type: result.data.type,
                  placement: 'top-right',
                  duration: 4
                });
        });
    }

});
