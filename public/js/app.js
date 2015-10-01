(function() {
    'use strict';
    
    var HOST = 'http://cloudbudget-febbweiss.c9.io/api';
    
    angular
        .module('cloudbudget', ['ngRoute', 'routes', 'ngCookies', 'xeditable'])
        .constant('apiRoutes', {
            'host'          : HOST,
            'port'          : "80",
            'login'         : HOST + '/users/login',
            'register'      : HOST + '/users',
            'unregister'    : HOST + '/users/',
            'accounts'      : HOST + '/accounts/'
        })
        .run(run);

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http', '$filter', 'editableThemes', 'editableOptions'];
    function run( $rootScope, $location, $cookieStore, $http, $filter, editableThemes, editableOptions) {
        
        editableThemes.bs3.inputClass = 'input-sm';
        editableThemes.bs3.buttonsClass = 'btn-sm';
        editableOptions.theme = 'bs3';
        
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