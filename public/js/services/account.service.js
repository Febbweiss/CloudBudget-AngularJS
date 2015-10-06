(function() {
    'use strict';
    
    angular
        .module('cloudbudget')
        .factory('AccountService', AccountService);
        
    AccountService.$inject =['$http', 'apiRoutes'];
    
    function AccountService($http, apiRoute) {
        
        var service = {};
        service.details = details;
        service.list = list;
        service.create = create;
        service.drop = drop;
        service.edit = edit;
        
        return service;
        
        function details(account_id) {
            return $http.get( apiRoute.accounts + account_id)
                .then(function handleSuccess(response) {
                    return {success: true, account: response.data};
                }, handleError('Error during accounts listing'));
        }
        
        function list(account_id) {
            return $http.get( apiRoute.accounts + account_id + '/entries')
                    .then(handleSuccess, handleError('Error listing account entries'));
        }
        
        function create(account, entry) {
            return $http.post( apiRoute.accounts + account._id + '/entries', entry)
                    .then(handleSuccess, handleError('Error creating entry'));
        }
        
        function drop(account, entry) {
            return $http.delete(apiRoute.accounts + account._id + '/entries/' + entry._id)
                    .then(handleSuccess, handleError('Error deleting entry'));
        }
        
        function edit(account, id, entry) {
            return $http.put(apiRoute.accounts + account._id + '/entries/' + id, entry)
                    .then(handleSuccess, handleError('Error updating entry'));
        }
        
        function handleSuccess(response) {
            return {success: true, data: response.data};
        }
        
        function handleError(error) {
            return function() {
                return {success: false, message: error};
            };
        }
    }
})();