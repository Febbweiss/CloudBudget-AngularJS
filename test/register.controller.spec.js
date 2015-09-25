describe('RegisterController', function() {
    
    var $location,
        $rootScope,
        $timeout,
        $httpBackend,
        UserService,
        AuthenticationServiceMock,
        FlashService,
        createController,
        apiRoutes,
        shouldPass;
        
    beforeEach(module('cloudbudget'));
    
    beforeEach(function() {
       module(function($provide) {
           $provide.factory('AuthenticationService', ['$q', '$rootScope', function($q, $rootScope) {
                function login(username, password ) {
                    var data;
                    if(shouldPass){
                        data = {
                                success: true,
                                user: {
                                    username: 'test',
                                    token: 'tok3n'
                                }
                            };
                    } else {
                        data = {
                                success: false,
                                message: 'Authentication fail'
                            };
                    }
                    return $q.when(data);
                }
                
                function setCredentials(user) {
                    $rootScope.globals = {
                        user: user,
                        token: user.token
                    }
                }
                
                function clearCredentials() {
                    $rootScope.globals = {};
                }
                
                return{
                    login: login,
                    setCredentials: setCredentials,
                    clearCredentials: clearCredentials
                };
            }]);
       }) 
    });
    
    beforeEach(inject(function ( _$rootScope_, _$httpBackend_,  $controller, _$location_, _$timeout_, AuthenticationService, _UserService_, _FlashService_, _apiRoutes_) {
        $location = _$location_;
        $httpBackend = $httpBackend;
        $rootScope = _$rootScope_.$new();
        $timeout = _$timeout_;
        AuthenticationServiceMock = AuthenticationService;
        UserService = _UserService_;
        FlashService = _FlashService_;
        apiRoutes = _apiRoutes_;
        
        createController = function() {
            return $controller('RegisterController', {
                '$rootScope': $rootScope,
                AuthenticationService: AuthenticationServiceMock,
                UserService: _UserService_,
                FlashService: _FlashService_
            });
        };
    }));
    
    describe('register()', function() {
        it('should register successfully', inject(function($controller, $httpBackend, $location) {
            shouldPass = true;
            
            $httpBackend.expect('POST', apiRoutes.register)
                .respond({
                    username: 'test',
                    token: 'tok3en'
                });

            
            var registerController = createController();
            registerController.user = {
                username: 'test',
                password: 's3cr3t',
                language: 'en'
            };
            
            registerController.register();
            $httpBackend.flush();
            $timeout.flush();
            
            $location.path().should.be.equal('/');
        }));
        
        it('should fail to register on bad parameter', inject(function($controller, $httpBackend, $location) {
            shouldPass = false;
            
            $httpBackend.expect('POST', apiRoutes.register)
                .respond(400);

            
            var registerController = createController();
            registerController.user = {
                username: 'test',
                password: 'secret'
            };
            
            registerController.register();
            $httpBackend.flush();
            $timeout.flush();
            
            $location.path().should.be.equal('/login');
        }));
        
        it('should fail to register on duplicate user', inject(function($controller, $httpBackend, $location) {
            shouldPass = false;
            
            $httpBackend.expect('POST', apiRoutes.register)
                .respond(409);

            
            var registerController = createController();
            registerController.user = {
                username: 'test',
                password: 'secret'
            };
            
            registerController.register();
            $httpBackend.flush();
            $timeout.flush();
            
            $location.path().should.be.equal('/login');
        }));
    });
});