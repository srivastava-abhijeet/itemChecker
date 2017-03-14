(function() {

    var app = angular.module("itemCheckerModule");

    var sidebarDirective = function() {

        return {
            link: function(scope, element, attr) {
                scope.$watch(attr.sidebarDirective, function(newVal) {
                    if (newVal) {
                        element.addClass('show');
                        return;
                    }
                    element.removeClass('show');
                });
            }
        };
    };

    app.directive("sidebarDirective", sidebarDirective);

}());
