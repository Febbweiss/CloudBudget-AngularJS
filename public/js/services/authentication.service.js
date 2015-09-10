(function() {
   'use strict';
   
   angular
        .module('cloudbudget')
        .factory('AuthenticationService', AuthenticationService);
        
    AuthenticationService.$inject = ['$http', '$cookieStore', '$rootScope', 'apiRoutes'];
    
    function AuthenticationService($http, $cookieStore, $rootScope, apiRoutes) {
        var service = {};
        service.login = login;
        service.setCredentials = setCredentials;
        service.clearCredentials = clearCredentials;

        return service;
        
        function login(username, password ) {
            return $http.post( apiRoutes.login, {username: username, password: password})
                .then(function(response, status) {
                    if( status === 200 ) {
                        return {
                            success: true,
                            user: response
                        };
                    } else {
                        return {
                            success: false,
                            message: response.message
                        };
                    }
                }, function(response) {
                    return {
                        success: false,
                        message: 'An error occurs'
                    };
                });
        }
        
        function setCredentials(user) {
            $rootScope.globals = {
                user: user,
                token: user.token
            }
            
            $http.defaults.headers.common['Authorization'] = 'JWT ' + user.token;
            $cookieStore.put('globals', $rootScope.globals);
            console.log( $cookieStore.get('globals'));
        }
        
        function clearCredentials() {
            $rootScope.globals = {};
            $http.defaults.headers.common.Authorization = 'JWT ';
            $cookieStore.remove('globals');
        }
    }
})();