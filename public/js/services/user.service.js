(function() {
    'use strict';
    
    angular
        .module('cloudbudget')
        .factory('UserService', UserService);
        
    UserService.$inject = ['$http', 'apiRoutes'];
    
    function UserService($http, apiRoutes) {
        
        var service = {};
        service.register = register;
        service.unregister = unregister;
        
        return service;
        
        function register(user) {
            return $http.post( apiRoutes.register, user)
                    .then(handleSuccess, handleError('Error creating user'));
        }
        
        function unregister(id) {
            return $http.delete( apiRoutes.unregister + id)
                    .then(handleSuccess, handleError('Error deleting user'));
        }
        
        function handleSuccess(response) {
            return {success: true, user: response.data};
        }
        
        function handleError(error) {
            return function() {
                return {success: false, message: error};
            };
        }
    }
})();