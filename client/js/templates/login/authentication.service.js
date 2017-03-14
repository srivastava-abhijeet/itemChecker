(function() {

    var app = angular.module("itemCheckerModule");

    var AuthenticationService = function($http, $cookieStore, $rootScope, $timeout) {

        var service = {};

        service.Login = function(username, password, callback) {

            $timeout(function() {
                var response = {
                    success: username === 'ces' && password === 'ces'
                };
                if (!response.success) {
                    response.message = 'User name or password is incorrect';
                }
                callback(response);
            }, 1000);
        };

        service.setCredentials = function(username, password) {

            $rootScope.globals = {
                currentUser: {
                    username: username,
                    password: password
                }
            };

            $cookieStore.put('globals', $rootScope.globals);
        };

        service.clearCredentials = function() {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
        };

        return service;
    };

    app.factory('AuthenticationService', AuthenticationService);

}());
