describe('AccountController', function() {
    
    var $location,
        $rootScope,
        $scope,
        $timeout,
        $httpBackend,
        $filter,
        AccountService,
        FlashService,
        createController,
        apiRoutes,
        shouldPass,
        DEFAULT_ACCOUNT = {
            "name": "test",
            "reference": "1234567890",
            "user_id": "55b78934d2a706265ea28e9c",
            "_id": "560aa0e79633cd7c1495ff21",
             "categories": [{
                "key": "alimony_payments",
                "label": "Alimony Payments",
                "_id": "560a84058812ad8d0ff200ef",
                "sub_categories": []
            }, {
                "key": "automobile_expenses",
                "label": "Automobile Expenses",
                "_id": "560a84058812ad8d0ff200f0",
                "sub_categories": [{
                    "label": "Car Payment",
                    "key": "car_payment",
                    "_id": "560a84058812ad8d0ff200f3"
                }, {
                    "label": "Gasoline",
                    "key": "gasoline",
                    "_id": "560a84058812ad8d0ff200f2"
                }, {
                    "label": "Maintenance",
                    "key": "maintenance",
                    "_id": "560a84058812ad8d0ff200f1"
                }]
            }]
        },
        DEFAULT_ENTRY = {
            "_id": "561280789f3c83904adcf41b",
            "account_id": "560a84058812ad8d0ff200ee",
            "amount": 100,
            "date": "2015-09-29T22:00:00.000Z",
            "type": "DEPOSIT",
            "category": "560a84058812ad8d0ff200f0",
            "sub_category": "560a84058812ad8d0ff200f3"
        },
        DEFAULT_ACCOUNTS = [
            {
                "_id": "560a84058812ad8d0ff200ee",
                "name": "foo",
                "reference": "baz",
                "user_id": "55b78934d2a706265ea28e9c"
            }, {
                "_id": "560a7ad08812ad8d0ff20068",
                "name": "bar",
                "user_id": "55b78934d2a706265ea28e9c"
            }
        ];
        
    beforeEach(module('cloudbudget'));
    
    beforeEach(inject(function ( _$rootScope_, _$httpBackend_,  $controller, _$location_, _$timeout_, _$filter_, _AccountService_, _FlashService_, _apiRoutes_) {
        $location = _$location_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $scope.form = {
          $valid: true,
          $setPristine: function() {}
        };
        $timeout = _$timeout_;
        $filter = _$filter_;
        AccountService = _AccountService_;
        FlashService = _FlashService_;
        apiRoutes = _apiRoutes_;
        
        createController = function() {
            return $controller('AccountController', {
                '$scope': $scope,
                '$location': $location,
                '$rootScope': $rootScope,
                '$routeParams': {account_id: DEFAULT_ACCOUNT._id},
                FlashService: _FlashService_,
                AccountService: _AccountService_
            });
        };
    }));
    
    describe('init()', function() {
        it('should init successfully', inject(function($httpBackend, $rootScope) {
            $httpBackend.expect('GET', apiRoutes.accounts +  DEFAULT_ACCOUNT._id)
                .respond(DEFAULT_ACCOUNT);
    
            $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id + '/entries')
                .respond({entry: null, entries:[DEFAULT_ENTRY], balance: 100});
                
            $httpBackend.expect('GET', apiRoutes.accounts )
                .respond(DEFAULT_ACCOUNTS);
            
            var accountController = createController();
            $httpBackend.flush();
            $timeout.flush();
            
            should.exist(accountController.account);
            accountController.account._id.should.be.equal(DEFAULT_ACCOUNT._id);
            accountController.entries.should.be.instanceof(Array).and.have.lengthOf(1);
            accountController.balance.should.be.equal(100);
            $rootScope.accounts.should.be.instanceof(Array).and.have.lengthOf(2);
        }));
        
        it('should fail to init', inject(function($httpBackend, $rootScope) {
            $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id)
                .respond(400);
    
            $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id + '/entries')
                .respond(400);
                
            $httpBackend.expect('GET', apiRoutes.accounts )
                .respond(400);
                
            var accountController = createController();
            $httpBackend.flush();
            $timeout.flush();
            
            should.not.exist(accountController.account);
            accountController.entries.should.be.instanceof(Array).and.have.lengthOf(0);
            should.not.exist(accountController.balance);
            should.not.exist($rootScope.accounts);
        }));
    });
    
    describe('* create()', function() {
        it('should create successfully', inject(function($httpBackend) {
            $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id)
                .respond(DEFAULT_ACCOUNT);
    
            $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id + '/entries')
                .respond({entry: null, entries:[], balance: 0});
                
            $httpBackend.expect('GET', apiRoutes.accounts )
                .respond(DEFAULT_ACCOUNTS);
                
            var accountController = createController();
            $httpBackend.flush();
            $timeout.flush();
            
            $httpBackend.expect('POST', apiRoutes.accounts + DEFAULT_ACCOUNT._id + '/entries')
                .respond({entry: DEFAULT_ENTRY, entries:[DEFAULT_ENTRY], balance: 100});

            accountController.entry = DEFAULT_ENTRY;
            
            accountController.create();
            $httpBackend.flush();
            $timeout.flush();
            
            var entry = accountController.entries[0];
            entry.amount.should.be.equal(DEFAULT_ENTRY.amount);
            entry.category.should.be.equal(DEFAULT_ENTRY.category);
            entry.sub_category.should.be.equal(DEFAULT_ENTRY.sub_category);
            entry.type.should.be.equal(DEFAULT_ENTRY.type);
            should.exist(entry._id);
            accountController.balance.should.be.equal(100);
        }));
        
        it('should fail to create entry', inject(function($httpBackend) {
            $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id)
                .respond(DEFAULT_ACCOUNT);
    
            $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id + '/entries')
                .respond({entry: null, entries:[], balance: 0});
            
            $httpBackend.expect('GET', apiRoutes.accounts )
                .respond(DEFAULT_ACCOUNTS);
                
            var accountController = createController();
            $httpBackend.flush();
            $timeout.flush();
            
            $httpBackend.expect('POST', apiRoutes.accounts + DEFAULT_ACCOUNT._id + '/entries')
                .respond(400, [{"field":"amount","rule":"required","message":"Path `amount` is required."}]);

            
            accountController.entry = {
                date: DEFAULT_ENTRY.date
            };
            
            accountController.create();
            $httpBackend.flush();
            $timeout.flush();
            
            accountController.entries.should.be.instanceof(Array).and.have.lengthOf(0);
            accountController.balance.should.be.equal(0);
        }));
    });
    
    describe('* delete()', function() {
        it('should delete successfully', inject(function($httpBackend) {
            $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id)
                .respond(DEFAULT_ACCOUNT);
    
            $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id + '/entries')
                .respond({entry: null, entries:[DEFAULT_ENTRY], balance: 100});
            
            $httpBackend.expect('GET', apiRoutes.accounts )
                .respond(DEFAULT_ACCOUNTS);
                
            var accountController = createController();
            $httpBackend.flush();
            $timeout.flush();
            
            $httpBackend.expect('DELETE', apiRoutes.accounts + DEFAULT_ACCOUNT._id + '/entries/' + DEFAULT_ENTRY._id)
                .respond(204, {entry: null, entries:[], balance: 0});

            accountController.drop( accountController.entries[0] );
            
            $httpBackend.flush();
            $timeout.flush();
            
            accountController.entries.should.be.instanceof(Array).and.have.lengthOf(0);
            accountController.balance.should.be.equal(0);
        }));
        
        it('should fail to delete unknown entry', inject(function($httpBackend) {
            $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id)
                .respond(DEFAULT_ACCOUNT);
    
            $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id + '/entries')
                .respond({entry: null, entries:[DEFAULT_ACCOUNT], balance: 100});
                
            $httpBackend.expect('GET', apiRoutes.accounts )
                .respond(DEFAULT_ACCOUNTS);
                
            var accountController = createController();
            $httpBackend.flush();
            $timeout.flush();
            
            $httpBackend.expect('DELETE', apiRoutes.accounts + DEFAULT_ACCOUNT._id + '/entries/fake_id')
                .respond(200, {entry: null, entries:[DEFAULT_ENTRY], balance: 100});

            accountController.drop({_id: 'fake_id'});
            $httpBackend.flush();
            $timeout.flush();
            
            accountController.entries.should.be.instanceof(Array).and.have.lengthOf(1);
            accountController.entries[0]._id.should.be.equal(DEFAULT_ENTRY._id);
            accountController.balance.should.be.equal(100);
        }));
    });

    describe('* edit()', function() {
        it('should edit successfully', inject(function($httpBackend) {
            $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id)
                .respond(DEFAULT_ACCOUNT);
    
            $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id + '/entries')
                .respond({entry: null, entries:[DEFAULT_ENTRY], balance: 100});
                
            $httpBackend.expect('GET', apiRoutes.accounts )
                .respond(DEFAULT_ACCOUNTS);
                
            var accountController = createController();
            $httpBackend.flush();
            $timeout.flush();
            
            var altered_entry = {
                "_id": "561280789f3c83904adcf41b",
                "account_id": "560a84058812ad8d0ff200ee",
                "amount": 120,
                "date": "2015-09-29T22:00:00.000Z",
                "type": "DEPOSIT",
                "category": "560a84058812ad8d0ff200f0",
                "sub_category": "560a84058812ad8d0ff200f3"
            };
        
            $httpBackend.expect('PUT', apiRoutes.accounts + DEFAULT_ACCOUNT._id + '/entries/' + DEFAULT_ENTRY._id)
                .respond({entry: altered_entry, entries:[altered_entry], balance: 120});

            accountController.edit(altered_entry, DEFAULT_ENTRY);
            $httpBackend.flush();
            $timeout.flush();
            
            var entry = accountController.entries[0];
            entry.amount.should.be.equal(altered_entry.amount);
            entry.category.should.be.equal(DEFAULT_ENTRY.category);
            entry.sub_category.should.be.equal(DEFAULT_ENTRY.sub_category);
            entry.type.should.be.equal(DEFAULT_ENTRY.type);
            accountController.balance.should.be.equal(120);
        }));
        
        it('should fail to edit unknown entry', inject(function($httpBackend) {
            $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id)
                .respond(DEFAULT_ACCOUNT);
    
            $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id + '/entries')
                .respond({entry: null, entries:[DEFAULT_ENTRY], balance: 100});
                
            $httpBackend.expect('GET', apiRoutes.accounts )
                .respond(DEFAULT_ACCOUNTS);
                
            var accountController = createController();
            $httpBackend.flush();
            $timeout.flush();
            
            var altered_entry = {
                "_id": "561280789f3c83904adcf41b",
                "account_id": "560a84058812ad8d0ff200ee",
                "amount": 120,
                "date": "2015-09-29T22:00:00.000Z",
                "type": "DEPOSIT",
                "category": "560a84058812ad8d0ff200f0",
                "sub_category": "560a84058812ad8d0ff200f3"
            };
        
            $httpBackend.expect('PUT', apiRoutes.accounts + DEFAULT_ACCOUNT._id + '/entries/' + DEFAULT_ENTRY._id)
                .respond(400, {entry: DEFAULT_ENTRY, entries:[DEFAULT_ENTRY], balance: 100});

            accountController.edit(altered_entry, DEFAULT_ENTRY);
            $httpBackend.flush();
            $timeout.flush();
            
            var entry = accountController.entries[0];
            entry.amount.should.be.equal(DEFAULT_ENTRY.amount);
            entry.category.should.be.equal(DEFAULT_ENTRY.category);
            entry.sub_category.should.be.equal(DEFAULT_ENTRY.sub_category);
            entry.type.should.be.equal(DEFAULT_ENTRY.type);
            accountController.balance.should.be.equal(100);
        }));
    });
    
    describe('Filters', function() {
       describe('* CategoryFilter', function() {
          it('should return empty without inputs', function() {
                var result = $filter('category')(undefined, DEFAULT_ACCOUNT.categories);
                
                result.should.be.equal('');
          });
          
          it('should return empty for invalid input', function() {
                var result = $filter('category')('fake_id', DEFAULT_ACCOUNT.categories);
                
                result.should.be.equal('');
          });
          
          it('should return label successfully', function() {
                var result = $filter('category')('560a84058812ad8d0ff200f0', DEFAULT_ACCOUNT.categories);
                result.should.be.equal('Automobile Expenses');
          });
       });
       
       describe('* SubcategoryFilter', function() {
          it('should return empty without input', function() {
                var result = $filter('sub_category')(undefined, undefined, DEFAULT_ACCOUNT.categories);
                
                result.should.be.equal('');
          });
          
          it('should return empty without category_id', function() {
                var result = $filter('sub_category')('560a84058812ad8d0ff200f3', undefined, DEFAULT_ACCOUNT.categories);
                
                result.should.be.equal('');
          });
          
          it('should return empty without sub_category_id', function() {
                var result = $filter('sub_category')(undefined, '560a84058812ad8d0ff200f0', DEFAULT_ACCOUNT.categories);
                
                result.should.be.equal('');
          });
          
          it('should return empty with invalid category_id', function() {
                var result = $filter('sub_category')('560a84058812ad8d0ff200f3', 'fake_id', DEFAULT_ACCOUNT.categories);
                
                result.should.be.equal('');
          });
          
          it('should return empty with invalid sub_category_id', function() {
                var result = $filter('sub_category')('fake_id', '560a84058812ad8d0ff200f0', DEFAULT_ACCOUNT.categories);
                
                result.should.be.equal('');
          });
          
          it('should return label successfully', function() {
                var result = $filter('sub_category')('560a84058812ad8d0ff200f3', '560a84058812ad8d0ff200f0', DEFAULT_ACCOUNT.categories);
                result.should.be.equal('Car Payment');
          });
       });
    });
    
    describe('UI', function() {
        describe('* update subcategory for main form', function() {
            it('should return subcategory successfully', inject(function($httpBackend) {
                $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id)
                    .respond(DEFAULT_ACCOUNT);
        
                $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id + '/entries')
                    .respond({entry: null, entries:[], balance: 0});
                    
                $httpBackend.expect('GET', apiRoutes.accounts )
                    .respond(DEFAULT_ACCOUNTS);
                    
                var accountController = createController();
                $httpBackend.flush();
                $timeout.flush();
                
                accountController.entry = {category: '560a84058812ad8d0ff200f0'};
                accountController.updateSubCategory();
                
                accountController.sub_categories.should.be.instanceof(Array).and.have.lengthOf(3);
            }));
            
            it('should return empty subcategory list successfully', inject(function($httpBackend) {
                $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id)
                    .respond(DEFAULT_ACCOUNT);
        
                $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id + '/entries')
                    .respond({entry: null, entries:[], balance: 0});
                    
                $httpBackend.expect('GET', apiRoutes.accounts )
                    .respond(DEFAULT_ACCOUNTS);
                    
                var accountController = createController();
                $httpBackend.flush();
                $timeout.flush();
                
                accountController.entry = {category: '560a84058812ad8d0ff200ef'};
                accountController.updateSubCategory();
                
                accountController.sub_categories.should.be.instanceof(Array).and.have.lengthOf(0);
            }));
            
            it('should return empty subcategory list for unknown category', inject(function($httpBackend) {
                $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id)
                    .respond(DEFAULT_ACCOUNT);
        
                $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id + '/entries')
                    .respond({entry: null, entries:[], balance: 0});
                    
                $httpBackend.expect('GET', apiRoutes.accounts )
                    .respond(DEFAULT_ACCOUNTS);
                    
                var accountController = createController();
                $httpBackend.flush();
                $timeout.flush();
                
                accountController.entry = {category: 'fake_id'};
                accountController.updateSubCategory();
                
                accountController.sub_categories.should.be.instanceof(Array).and.have.lengthOf(0);
            }));
        });
        
        describe('* update subcategory for inplace editor form', function() {
            it('should return subcategory successfully', inject(function($httpBackend) {
                $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id)
                    .respond(DEFAULT_ACCOUNT);
        
                $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id + '/entries')
                    .respond({entry: null, entries:[], balance: 0});
                    
                $httpBackend.expect('GET', apiRoutes.accounts )
                    .respond(DEFAULT_ACCOUNTS);
                    
                var accountController = createController();
                $httpBackend.flush();
                $timeout.flush();
                
                accountController.updateSubCategoryEditForm('560a84058812ad8d0ff200f0');
                
                accountController.edit_sub_categories.should.be.instanceof(Array).and.have.lengthOf(3);
                accountController.disabledSubCategories.should.be.false;
            }));
            
            it('should return empty subcategory list successfully', inject(function($httpBackend) {
                $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id)
                    .respond(DEFAULT_ACCOUNT);
        
                $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id + '/entries')
                    .respond({entry: null, entries:[], balance: 0});
                    
                $httpBackend.expect('GET', apiRoutes.accounts )
                    .respond(DEFAULT_ACCOUNTS);
                    
                var accountController = createController();
                $httpBackend.flush();
                $timeout.flush();
                
                accountController.updateSubCategoryEditForm('560a84058812ad8d0ff200ef');
                
                accountController.edit_sub_categories.should.be.instanceof(Array).and.have.lengthOf(0);
                accountController.disabledSubCategories.should.be.true;
            }));
            
            it('should return empty subcategory list for unknown category', inject(function($httpBackend) {
                $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id)
                    .respond(DEFAULT_ACCOUNT);
        
                $httpBackend.expect('GET', apiRoutes.accounts + DEFAULT_ACCOUNT._id + '/entries')
                    .respond({entry: null, entries:[], balance: 0});
                    
                $httpBackend.expect('GET', apiRoutes.accounts )
                    .respond(DEFAULT_ACCOUNTS);
                    
                var accountController = createController();
                $httpBackend.flush();
                $timeout.flush();
                
                accountController.updateSubCategoryEditForm('fake_id');
                
                accountController.edit_sub_categories.should.be.instanceof(Array).and.have.lengthOf(0);
                accountController.disabledSubCategories.should.be.true;
            }));
        });
    })

});