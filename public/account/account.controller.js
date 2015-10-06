(function(){
    'use strict';
    
    angular
        .module('cloudbudget')
        .filter('category', CategoryFilter)
        .filter('sub_category', SubcategoryFilter)
        .controller('AccountController', AccountController);
        
    function CategoryFilter() {
        return function(input, categories) {
              if( !input ) {
                  return '';
              }
            var category = categories.filter(function(elt, idx) {
                    return elt._id === input;
                });
            if( category.length > 0 ) {
                return category[0].label;
            } 
            return '';
          };
    }
    
    function SubcategoryFilter() {
        return function(input, category_id, categories) {
            if( !input || !category_id) {
                return '';
            }
            
            var category = categories.filter(function(elt, idx) {
                return elt._id === category_id;
            })[0];
            
            if( !category ) {
                return ''; 
            }

            var res = category.sub_categories.filter( function(elt, idx) {
                            return elt._id === input;
                        });        
            if( res.length === 1 ) {
                return res[0].label;
            } else {
                return '';
            }
          };
    }
        
    AccountController.$inject = ['$scope', '$location', '$routeParams', 'FlashService', 'AccountService'];
    
    function AccountController($scope, $location, $routeParams, FlashService, AccountService) {
        var vm = this;
        
        $scope.calendar = {
            opened: {},
            dateFormat: 'dd/MM/yyyy',
            dateOptions: {},
            open: function($event, which) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.calendar.opened[which] = true;
            } 
        };

        vm.dataLoading = false;
        vm.entries = [];
        vm.categories = [];
        vm.sub_categories = [];
        vm.account = undefined;
        vm.create = create;
        vm.drop = drop;
        vm.edit = edit;
        vm.updateSubCategory = updateSubCategory;
        vm.updateSubCategoryEditForm = updateSubCategoryEditForm;
        vm.disabledSubCategories = false;
        vm.edit_sub_categories = [];
        
        (function init() {
            vm.dataLoading = true;
            AccountService.details($routeParams.account_id)
                .then(function(response) {
                    if( response.success ) {
                        vm.account = response.account;
                        vm.categories = angular.copy(vm.account.categories);
                        vm.categories.unshift({_id: '', label: ''});
                    } else {
                        FlashService.error(response.message);
                    }
                    vm.dataLoading = false;
                });
            AccountService.list($routeParams.account_id)
                .then(function(response) {
                   if( response.success ) {
                       vm.entries = response.data.entries;
                   } else {
                       FlashService.error(response.message);
                   }
                });
        })();
        
        function create() {
            vm.dataLoading = true;
            AccountService.create(vm.account, vm.entry)
                .then( function(response) {
                    if( response.success) {
                        vm.entries = response.data.entries;
                    } else {
                        FlashService.error(response.message);
                    }
                    
                    vm.dataLoading = false;
                });
            vm.entry = angular.copy({});
            $scope.form.$setPristine();
        };
        
        function drop(entry) {
            vm.dataLoading = true;
            AccountService.drop(vm.account, entry)
                .then(function(response) {
                    if( response.success ) {
                       vm.entries = response.data.entries;
                    } else {
                        FlashService.error( response.message );
                    }
                    vm.dataLoading = false;
                });
        };
        
        function edit(altered, origin) {
            vm.dataLoading = true;
            return AccountService.edit(vm.account, origin._id, altered)
                .then( function(response) {
                    vm.dataLoading = false;
                    if( response.success ) {
                        var index = vm.entries.map(function (item) {
                                return item._id;
                            }).indexOf(origin._id);
                        vm.entries[index] = response.data.entries[index];
                    } else {
                        var index = vm.entries.map(function (item) {
                                return item._id;
                            }).indexOf(origin._id);
                        vm.entries[index] = origin;
                        FlashService.error( response.message );
                        return false;
                    }
                })
        };
        
        function updateSubCategory() {
            vm.sub_categories = getSubCategories(vm.entry.category);
        };
        
        function updateSubCategoryEditForm(category_id) {
            vm.edit_sub_categories = getSubCategories(category_id);
            vm.disabledSubCategories = !vm.edit_sub_categories || vm.edit_sub_categories.length === 0;
        };
        
        function getSubCategories(category_id) {
            var categories = vm.categories.filter(function(elt, idx) {
                return elt._id === category_id;
            });
            if( categories.length === 0 ) {
                return [];
            } else {
                return categories[0].sub_categories;
            }
        }
    }
})();