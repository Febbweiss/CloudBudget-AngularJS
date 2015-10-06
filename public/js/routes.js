(function() {
    'use strict';
    
    angular
        .module('routes', [])
        .config(config);
        
    config.$inject = ['$routeProvider', '$locationProvider'];
   
    function config($routeProvider, $locationProvider) {
        
        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'home/home.view.html',
                controllerAs: 'vm'
            })
            
            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
                controllerAs: 'vm'
            })
            
            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'register/register.view.html',
                controllerAs: 'vm'
            })
            
            .when('/accounts', {
                controller: 'AccountsController',
                templateUrl: 'accounts/accounts.view.html',
                controllerAs: 'vm'
            })
            
            .when('/account/:account_id', {
                controller: 'AccountController',
                templateUrl: 'account/account.view.html',
                controllerAs: 'vm'
            })
            
            .otherwise({redirectTo: '/login'});
            
        $locationProvider.html5Mode(true);
    };
})();