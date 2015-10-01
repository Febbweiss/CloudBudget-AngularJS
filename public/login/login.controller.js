(function() {
    'use strict';
    
    angular
        .module('cloudbudget')
        .controller('LoginController', LoginController);
        
    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
    
    function LoginController($location, AuthenticationService, FlashService) {
        var vm = this;
        
        vm.login = login;
        
        (function initController() {
            AuthenticationService.clearCredentials();
        })();
        
        function login() {
            vm.dataLoading = true;
            AuthenticationService.login(vm.username, vm.password).then( function(response) {
                if( response.success ) {
                    AuthenticationService.setCredentials(response.user);
                    $location.path('/accounts');
                } else {
                    FlashService.error(response.message);
                    vm.dataLoading = false;
                }
            });
        }
    }
})();