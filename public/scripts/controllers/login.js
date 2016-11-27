'use strict';

/**
 * @ngdoc function
 * @name biblotecaApp.controller:LoginCtrl
 * @Author Juan Manuel López Bedoya (juanma0474@hotmail.com)
 * @description
 * # LoginCtrl : Controlador que permite validar los datos del usaurio para permitirle el ingreso
 * Controller of the biblotecaApp
 */
 angular.module('biblotecaApp')
 .controller('LoginCtrl', function ($scope, $location, $window, loginService, $rootScope, $alert) {

    //Admin User Controller (login, logout)
    $scope.login = function (user) {
        
        loginService.login(user).then(function(result){
            var data = result.data;
            var token = JSON.stringify(data.token);
            var user =  JSON.stringify(data.user);
            if(!$window.localStorage.getItem("token")){
                $window.localStorage.setItem("token", token);
                $window.localStorage.setItem("user", user);
                //$window.sessionStorage.setItem("user", user);
            }
            $rootScope.userIn = data.user;
            $location.path(data.user.path);
        }, function(error){
            
            $alert({
                  content: error.data.msg,
                  animation: 'fadeZoomFadeDown',
                  type: 'danger',
                  placement: 'top-right',
                  duration: 4
                });
        });
        
    }

    $scope.pageClass = 'fadeZoom';


});