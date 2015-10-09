(function() {
    'use strict';
    
    angular
        .module('cloudbudget')
        .controller('GlobalController', GlobalController);
        
    GlobalController.$inject = ['$scope', '$rootScope', '$location'];
    
    function GlobalController($scope, $rootScope, $location) {
        var vm = this;
        
        vm.change_account = change_account;
        vm.current_account = undefined;
        
        $scope.$watch(function() {
            return $rootScope.current_account;
        }, function() {
            vm.current_account = $rootScope.current_account;
        }, true);
        
        function change_account() {
            $location.path('/account/' + vm.current_account);
        };
    }
})();