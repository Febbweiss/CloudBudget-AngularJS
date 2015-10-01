(function() {
    'use strict';
    
    angular
        .module('cloudbudget')
        .factory('AccountsService', AccountsService);
        
    AccountsService.$inject =['$http', 'apiRoutes'];
    
    function AccountsService($http, apiRoute) {
        
        var service = {};
        service.list = list;
        service.create = create;
        service.drop = drop;
        service.edit = edit;
        
        return service;
        
        function list() {
            return $http.get( apiRoute.accounts)
                .then(function handleSuccess(response) {
                    return {success: true, accounts: response.data};
                }, handleError('Error during accounts listing'));
        }
        
        function create(account) {
            return $http.post( apiRoute.accounts, account)
                    .then(handleSuccess, handleError('Error creating account'));
        }
        
        function drop(account) {
            return $http.delete(apiRoute.accounts + account._id)
                    .then(handleSuccess, handleError('Error deleting account'));
        }
        
        function edit(id, account) {
            return $http.put(apiRoute.accounts + id, account)
                    .then(handleSuccess, handleError('Error updating account'));
        }
        
        function handleSuccess(response) {
            return {success: true, account: response.data};
        }
        
        function handleError(error) {
            return function() {
                return {success: false, message: error};
            };
        }
    }
})();