(function() {
    'use strict';
    
    var HOST = 'http://cloudbudget.pavnay.fr/api';
    
    angular
        .module('cloudbudget', ['ngRoute', 'routes', 'ngCookies'])
        .constant('apiRoutes', {
            'host': HOST,
            'port': "80",
            'login': HOST + '/users/login',
            'register': HOST + '/users',
            'unregister': HOST + '/users/'
        })
        .run(run);

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http', '$filter'];
    function run( $rootScope, $location, $cookieStore, $http, $filter) {
        $rootScope.globals = $cookieStore.get('globals') || {};
        if( $rootScope.globals.user && $rootScope.globals.user.token) {
            $http.defaults.headers.common['Authorization'] = 'JWT ' + $rootScope.globals.user.token;
        }
        
        $rootScope.$on('$locationChangeStart', function(event, next, current) {
           var restrictedPage = ['/login', '/register'].indexOf($location.path()) === -1;
                
           var loggedIn = $rootScope.globals.user;
           if( restrictedPage && !loggedIn ) {
               $location.path('/login');
           }
        });
    }
})();