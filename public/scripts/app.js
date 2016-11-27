'use strict';

/**
 * @ngdoc function
 * @description
 * # mainController
 * Controller of the anguApp
 */

 /*creamos nuestro modulo de angular*/
 angular
 .module('biblotecaApp', [
  'ngResource',
  'ngMessages',
  'ngRoute',
  'btford.socket-io',
  'ngAnimate',
  'mgcrea.ngStrap',
  'angular-jwt',
  'ngTable'
  ])
 .config(['$routeProvider', '$locationProvider', '$httpProvider', 'jwtInterceptorProvider',
  function ($routeProvider, $locationProvider, $httpProvider, jwtInterceptorProvider) {


    $locationProvider.html5Mode(false);

    jwtInterceptorProvider.tokenGetter = function(){
      return window.localStorage.getItem("token");
    }

    $httpProvider.interceptors.push("jwtInterceptor");

    $routeProvider
    .when('/login', {
     templateUrl: 'views/login.html',
     controller: 'LoginCtrl',
     access: {
      requiredLogin: false
    }
  })
    .when('/', {
     templateUrl: 'views/main.html',
     controller: 'MainCtrl',
     access: {
      requiredLogin: true,
      admin: false
    },
  })
    .when('/registrar', {
     templateUrl: 'views/create.html',
     controller: 'CreateCtrl',
     access: {
      requiredLogin: true,
      admin: false
    }
  })
    .when('/editar/:id', {
     templateUrl: 'views/edit.html',
     controller: 'EditCtrl',
     access: {
      requiredLogin: true,
      admin: false
    }
  })
    .when('/admin/usuarios', {
     templateUrl: 'views/usuarios.html',
     controller: 'UserCtrl',
     access: {
      requiredLogin: true,
      admin: true
    }
  })
    .when('/admin/password', {
     templateUrl: 'views/password.html',
     controller: 'PasswordCtrl',
     access: {
      requiredLogin: true,
      admin: true
    }
  })
    .when('/password', {
     templateUrl: 'views/password.html',
     controller: 'PasswordCtrl',
     access: {
      requiredLogin: true,
      admin: false
    }
  })
    .when('/admin/tipos', {
     templateUrl: 'views/tipo.html',
     controller: 'TipoCtrl',
     access: {
      requiredLogin: true,
      admin: true
    }
  })
    .when('/admin', {
     templateUrl: 'views/admin.html',
     controller: 'AdminCtrl',
     access: {
      requiredLogin: true,
      admin: true
    },
  })
    .otherwise({
     redirectTo: '/'
   });


 }])
.run(function($rootScope, $location, $window,requestService, $http){

  // keep user logged in after page refresh
      if ($window.localStorage.token) {

           $http.defaults.headers.common.Authorization = 'Bearer ' + $window.localStorage.token;
       }


  $rootScope.$on('$routeChangeStart', function(event, next, current){

    /*Se carga el servicio del usuario*/
    requestService.check();
    if(next.access != "undefined"){//si la siguiente ruta tiene la propiedad access
      /*se valida si las siguientes rutas requieren login y si no hay un usuario en session*/
      if((next.access.requiredLogin === "undefined" || next.access.requiredLogin) && !requestService.isLogged) {
        /*Se redirecciona al login*/
        $location.path("/login");
        return false;
      }else{
        /*Si hay un usuario en session*/
        if(requestService.isLogged){
          /*Se captura la info del usuario*/
          var usaurio = requestService.user;
          /*Se valida que las siguientes rutas sean de admin y el perfil no es admin*/
          if((next.access.admin == true && usaurio.admin != 1) ||
            (usaurio.admin != 1 && next.templateUrl == 'views/login.html')){
            /*se redirecciona a la pagina principal del perfil*/
            $location.path("/");

            return false;
        /*Se valida que las siguientes rutas no sean de admin y el perfil es admin*/
        }else if((next.access.admin == false && usaurio.admin == 1)  ||
          (usaurio.admin == 1 && next.templateUrl == 'views/login.html')){
          /*se redirecciona a la pagina principal del perfil*/
          $location.path("/admin");
          return false;
        }
      }else{
        /*Se redirecciona al login*/
        $location.path("/login");
        return false;
      }
    }
  }
});

});
