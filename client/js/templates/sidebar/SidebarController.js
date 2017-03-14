(function() {

    var app = angular.module("itemCheckerModule");

    var SidebarController = function($scope) {

        $scope.state = true;

        $scope.toggleState = function() {
            $scope.state = !$scope.state;
        };

    };

    app.controller("SidebarController", SidebarController);

}());
