(function(){
    'use strict';
    
    angular
        .module('cloudbudget')
        .controller('RegisterController', RegisterController);
        
    RegisterController.$inject = ['UserService', '$location', '$rootScope', 'AuthenticationService', 'FlashService'];
    
    function RegisterController(UserService, $location, $rootScope, AuthenticationService, FlashService) {
        var vm = this;
        
        vm.dataLoading = false;
        vm.register = register;
        
        function register() {
            vm.dataLoading = true;
            UserService.register(vm.user)
                .then(function(response) {
                    if( response.success ) {
                        AuthenticationService.setCredentials(response.user);
                        FlashService.success('Registration successful', true);
                        $location.path('/accounts');
                    } else {
                        FlashService.error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }
    }
})();