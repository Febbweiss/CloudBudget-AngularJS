(function() {
    'use strict';
    
    angular
        .module('cloudbudget')
        .factory('FlashService', FlashService);
        
    FlashService.$inject = ['$rootScope', 'growl'];
    
    function FlashService($rootScope, growl) {
        var service = {};
        
        service.success = success;
        service.error = error;
        
        return service;
        
        function success(message, keepAfterLocationChange) {
            growl.success(message,{title: 'Success!'});
        }
        
        function error(message, keepAfterLocationChange) {
            growl.error(message, {title: 'Error!'});
        }
    }
})();