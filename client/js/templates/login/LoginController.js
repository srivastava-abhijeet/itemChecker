(function() {
        
    var LoginController = function($scope, $rootScope, $location, AuthenticationService) {         // reset login status
                
        AuthenticationService.clearCredentials();          
        $scope.login = function() {            
            $scope.dataLoading = true;            
            AuthenticationService.Login($scope.username, $scope.password, function(response) {                
                if (response.success) {                    
                    AuthenticationService.setCredentials($scope.username, $scope.password);                    
                    $location.path('/main');                
                } else {                    
                    $scope.error = response.message;                    
                    $scope.dataLoading = false;                
                }            
            });        
        };    
    };

    var app = angular.module("itemCheckerModule");
    app.controller("LoginController", LoginController);


}());
