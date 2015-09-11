describe('LoginController', function() {
    
    var scope, 
        $location, 
        $timeout,
        $rootScope,
        AuthenticationServiceMock, 
        createController, 
        shouldPass;

    beforeEach(module('cloudbudget'));
    
    beforeEach(function(){
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
        });
    });
    
    beforeEach(inject(function ($rootScope, $controller, _$location_, _$timeout_, AuthenticationService) {
        $location = _$location_;
        scope = $rootScope.$new();
        $timeout = _$timeout_;
        AuthenticationServiceMock = AuthenticationService;
    
        createController = function() {
            return $controller('LoginController', {
                '$scope': scope,
                AuthenticationService: AuthenticationServiceMock
            });
        };
    }));

    describe('login()', function() {
        it('should log successfully', inject(function($controller, $location) {
            shouldPass = true;
    			
            var loginController = createController();
            
            loginController.username = 'fail';
            loginController.password = 's3cr3t';
            
            loginController.login();
            $timeout.flush();
            
            $location.path().should.be.equal('/');
        }));
        
        it('should fail to log', inject(function($controller, $location) {
            shouldPass = false;
            
            var loginController = $controller('LoginController');
    			
            loginController.username = 'fail';
            loginController.password = 'secret';
            
            loginController.login();
            $timeout.flush();
            
            $location.path().should.be.equal('/login');
        }));
    });
});