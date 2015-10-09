(function() {
    'use strict';
    
    angular
        .module('cloudbudget')
        .controller('GlobalController', GlobalController);
        
    GlobalController.$inject = ['$location', '$rootScope'];
    
    function GlobalController($location, $rootScope) {
        var vm = this;
        
        vm.change_account = change_account;
        vm.current_account = $rootScope.current_account;;
        
        $rootScope.$watch('current_account', function() {
            vm.current_account = $rootScope.current_account;
        });
        
        function change_account() {
            $location.path('/account/' + vm.current_account);
        };
    }
})();