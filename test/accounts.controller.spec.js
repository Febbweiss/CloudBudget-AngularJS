describe('AccountsController', function() {
    
    var $location,
        $rootScope,
        $scope,
        $timeout,
        $httpBackend,
        AccountsService,
        FlashService,
        createController,
        apiRoutes,
        shouldPass,
        DEFAULT_ACCOUNT = {
            "name": "test",
            "reference": "1234567890",
            "user_id": "55b78934d2a706265ea28e9c",
            "_id": "560aa0e79633cd7c1495ff21"
        };
        
    beforeEach(module('cloudbudget'));
    
    beforeEach(inject(function ( _$rootScope_, _$httpBackend_,  $controller, _$location_, _$timeout_, _AccountsService_, _FlashService_, _apiRoutes_) {
        $location = _$location_;
        $httpBackend = $httpBackend;
        $rootScope = _$rootScope_.$new();
        $scope = _$rootScope_.$new();
        $scope.form = {
          $valid: true,
          $setPristine: function() {}
        };
        $timeout = _$timeout_;
        AccountsService = _AccountsService_;
        FlashService = _FlashService_;
        apiRoutes = _apiRoutes_;
        
        createController = function() {
            return $controller('AccountsController', {
                '$scope': $scope,
                '$location': $location,
                '$rootScope': $rootScope,
                FlashService: _FlashService_,
                AccountsService: _AccountsService_,
            });
        };
    }));
    
    describe('init()', function() {
        it('should init successfully', inject(function($httpBackend) {
            $httpBackend.expect('GET', apiRoutes.accounts)
                .respond([DEFAULT_ACCOUNT]);
    
                
            var accountsController = createController();
            $httpBackend.flush();
            $timeout.flush();
            
            accountsController.accounts.should.be.instanceof(Array).and.have.lengthOf(1);
        }));
        
        it('should fail to init', inject(function($httpBackend) {
            $httpBackend.expect('GET', apiRoutes.accounts)
                .respond(400);
    
                
            var accountsController = createController();
            $httpBackend.flush();
            $timeout.flush();
            
            accountsController.accounts.should.be.instanceof(Array).and.have.lengthOf(0);
        }));
    });
    
    describe('* create()', function() {
        it('should create successfully', inject(function($httpBackend) {
            $httpBackend.expect('GET', apiRoutes.accounts)
                .respond([]);
                
            $httpBackend.expect('POST', apiRoutes.accounts)
                .respond(DEFAULT_ACCOUNT);

            
            var accountsController = createController();
            accountsController.account = {
                name: 'test',
                reference: '1234567890'
            };
            
            accountsController.create();
            $httpBackend.flush();
            $timeout.flush();
            
            var account = accountsController.accounts[0];
            account.name.should.be.equal('test');
            account.reference.should.be.equal('1234567890');
            should.exist(account._id);
        }));
        
        it('should fail to create account', inject(function($httpBackend) {
            $httpBackend.expect('GET', apiRoutes.accounts)
                .respond([]);
                
            $httpBackend.expect('POST', apiRoutes.accounts)
                .respond(400, [{"field":"name","rule":"required","message":"Path `name` is required."}]);

            
            var accountsController = createController();
            accountsController.account = {
                reference: '1234567890'
            };
            
            accountsController.create();
            $httpBackend.flush();
            $timeout.flush();
            
            accountsController.accounts.should.be.instanceof(Array).and.have.lengthOf(0);
        }));
    });
    
    describe('* delete()', function() {
        it('should delete successfully', inject(function($httpBackend) {
            $httpBackend.expect('GET', apiRoutes.accounts)
                .respond([DEFAULT_ACCOUNT]);
                
            $httpBackend.expect('DELETE', apiRoutes.accounts + DEFAULT_ACCOUNT._id)
                .respond(204);

            
            var accountsController = createController();
            accountsController.drop({_id: DEFAULT_ACCOUNT._id});
            $httpBackend.flush();
            $timeout.flush();
            
            accountsController.accounts.should.be.instanceof(Array).and.have.lengthOf(0);
        }));
        
        it('should fail to delete unknown account', inject(function($httpBackend) {
            $httpBackend.expect('GET', apiRoutes.accounts)
                .respond([DEFAULT_ACCOUNT]);
                
            $httpBackend.expect('DELETE', apiRoutes.accounts + 'fake_id')
                .respond(404);

            
            var accountsController = createController();
            accountsController.drop({_id: 'fake_id'});
            $httpBackend.flush();
            $timeout.flush();
            
            accountsController.accounts.should.be.instanceof(Array).and.have.lengthOf(1);
        }));
    });
    
    describe('* edit()', function() {
        it('should edit successfully', inject(function($httpBackend) {
            $httpBackend.expect('GET', apiRoutes.accounts)
                .respond([DEFAULT_ACCOUNT]);
                
            $httpBackend.expect('PUT', apiRoutes.accounts + DEFAULT_ACCOUNT._id)
                .respond(200, {
                    "name": "test updated",
                    "reference": "1234567890",
                    "user_id": "55b78934d2a706265ea28e9c",
                    "_id": "560aa0e79633cd7c1495ff21"
                });

            
            var accountsController = createController();
            accountsController.edit({ name:"test updated"}, DEFAULT_ACCOUNT);
            $httpBackend.flush();
            $timeout.flush();
            
            accountsController.accounts.should.be.instanceof(Array).and.have.lengthOf(1);
            var account = accountsController.accounts[0];
            account.name.should.be.equal('test updated');
        }));
        
        it('should fail to edit unknown account', inject(function($httpBackend) {
            $httpBackend.expect('GET', apiRoutes.accounts)
                .respond([DEFAULT_ACCOUNT]);
                
            $httpBackend.expect('PUT', apiRoutes.accounts + 'fake_id')
                .respond(404);

            
            var accountsController = createController();
            accountsController.edit({name:"test updated"}, {_id: 'fake_id'});
            $httpBackend.flush();
            $timeout.flush();
            
            accountsController.accounts.should.be.instanceof(Array).and.have.lengthOf(1);
            var account = accountsController.accounts[0];
            account.name.should.be.equal('test');
        }));
    });
    
    describe('* consult()', function() {
        it('should redirect to account consultation', inject(function($httpBackend,$rootScope, $location) {
            $httpBackend.expect('GET', apiRoutes.accounts)
                .respond([DEFAULT_ACCOUNT]);
                
            $rootScope.globals.user = true;
            
            var accountsController = createController();
            accountsController.consult(DEFAULT_ACCOUNT);
            $httpBackend.flush();
            $timeout.flush();
            
            $location.path().should.be.equal('/account/' + DEFAULT_ACCOUNT._id);
        }));
    })
});