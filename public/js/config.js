(function() {
    'use strict';
    
    angular
        .module('config', [])
        .config(config);
        
    config.$inject = ['growlProvider'];
   
    function config(growlProvider) {
        growlProvider.globalReversedOrder(true);
        growlProvider.globalTimeToLive(5000);
        growlProvider.globalDisableCountDown(true);
    };
})();