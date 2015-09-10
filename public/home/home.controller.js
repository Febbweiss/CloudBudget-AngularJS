(function() {
    'use strict';
    
    angular
        .module('cloudbudget')
        .controller('HomeController', HomeController);
        
    HomeController.$inject = ['$rootScope'];
    
    function HomeController($rootScope) {
        var vm = this;
        
        vm.firstname = '';
        vm.lastname = '';
        vm.getFullname = getFullname;
        vm.user = null;
        
        (function initController() {
            loadUser();
        })();
        
        function loadUser() {
            vm.user = $rootScope.globals.user;
        };
        
        function getFullname() {
            return vm.firstname + ' ' + vm.lastname;
        };
    }
})();