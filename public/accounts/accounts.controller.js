(function(){
    'use strict';
    
    angular
        .module('cloudbudget')
        .controller('AccountsController', AccountsController);
        
    AccountsController.$inject = ['$scope', '$location', '$rootScope', 'FlashService', 'AccountsService'];
    
    function AccountsController($scope, $location, $rootScope, FlashService, AccountsService) {
        var vm = this;
        
        vm.dataLoading = false;
        vm.accounts = [];
        vm.create = create;
        vm.drop = drop;
        vm.edit = edit;
        vm.consult = consult;
        
        (function init() {
            vm.dataLoading = true;
            AccountsService.list()
                .then(function(response) {
                    if( response.success ) {
                        vm.accounts = response.accounts;
                    } else {
                        FlashService.error(response.message);
                    }
                    vm.dataLoading = false;
                })
        })();
        
        function create() {
            vm.dataLoading = true;
            AccountsService.create(vm.account)
                .then( function(response) {
                    if( response.success) {
                        vm.accounts.push(response.account);
                    } else {
                        FlashService.error(response.message);
                    }
                    
                    vm.dataLoading = false;
                });
            vm.account = angular.copy({});
            $scope.form.$setPristine();
        };
        
        function drop(account) {
            vm.dataLoading = true;
            AccountsService.drop(account)
                .then(function(response) {
                    if( response.success ) {
                        var index = vm.accounts.indexOf(account);
                        vm.accounts.splice(index, 1);
                    } else {
                        FlashService.error( response.message );
                    }
                    vm.dataLoading = false;
                });
        };
        
        function edit(altered, origin) {
            vm.dataLoading = true;
            return AccountsService.edit(origin._id, altered)
                .then( function(response) {
                    if( response.success ) {
                        var index = vm.accounts.map(function (item) {
                                return item._id;
                            }).indexOf(origin._id);
                        vm.accounts[index] = response.account;
                    } else {
                        FlashService.error( response.message );
                        return false;
                    }
                })
        };
        
        function consult(account) {
            $location.path('/account/' + account._id);
        };
    }
})();