(function() {

    var app = angular.module("itemCheckerModule", ['ngRoute', 'angular-loading-bar','ngCookies']);

    app.config(function($routeProvider) {

        $routeProvider
            .when("/login", {

                templateUrl: "js/templates/login/login.html",
                controller: "LoginController"
            })
            .when("/main", {

                templateUrl: "js/templates/main/main.html",
                controller: "MainController"
            })
            .when("/ca", {

              templateUrl: "js/templates/ca/ca.html",
              controller: "CAController"

            })
            .when("/caaddress", {

                templateUrl: "js/templates/caaddress/caAddress.html",
                controller: "CAAddressController"

            })
            .when("/bundle", {

                templateUrl: "js/templates/bundle/bundle.html",
                controller: "bundleController"

            })
            .otherwise({
                redirectTo: "/login"
            });

    });

    app.run(function ($rootScope, $location, $cookieStore, $http) {
          // keep user logged in after page refresh
          var tempGlobals = $cookieStore.get('globals');
          $rootScope.globals = tempGlobals || {};
          // if ($rootScope.globals.currentUser) {
          //     $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
          // }

          $rootScope.$on('$locationChangeStart', function (event, next, current) {
              // redirect to login page if not logged in
              if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                  $location.path('/login');
              }
            });
      });

}());
