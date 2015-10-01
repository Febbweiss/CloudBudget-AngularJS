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
        
        initService();
        
        return service;
        
        function initService() {
            $rootScope.$on('$locationChangeStart', function() {
                clearFlashMessage();
            });
            
            function clearFlashMessage() {
                var flash = $rootScope.flash;
                if( flash ) {
                    if( !flash.keepAfterLocationChange ) {
                        delete $rootScope.flash;
                    } else {
                        flash.keepAfterLocationChange = false;
                    }
                }
            }
        }
        
        function success(message, keepAfterLocationChange) {
            growl.success(message,{title: 'Success!'});
        }
        
        function error(message, keepAfterLocationChange) {
            growl.error(message, {title: 'Error!'});
        }
    }
})();