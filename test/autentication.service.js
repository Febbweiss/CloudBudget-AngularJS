'use strict';

describe('AuthenticationService', function() {
    var AuthenticationService, httpBackend, rootScope, cookieStore;
    
    beforeEach(module('cloudbudget'));
    beforeEach(inject(function(_AuthenticationService_, $httpBackend, $rootScope, $cookieStore) {
        AuthenticationService = _AuthenticationService_;
        httpBackend = $httpBackend;
        rootScope = $rootScope;
        cookieStore = $cookieStore;
    }));
    
    describe('* login()', function() {
        
        it('should login successfully and return user', function() {
            httpBackend
    			.when('POST', 'api/users/login')
    			.respond(200, {username: 'test', token: 'tok3n'});
    			
    		AuthenticationService.login('test', 'password', function(data) {
    		    data.success.should.be.true;
    		    
    		    var user = data.user;
    		    should.exist(user);
    		    user.username.should.be.equal('test');
    		    user.token.should.be.equal('tok3n');
    		    
    		    should.not.exist(data.message);
    		});
        });
        
        it('should fail to login and return message', function() {
            httpBackend
                .when('POST', 'api/users/login')
                .respond(401);
                
            AuthenticationService.login('test', 'password', function(data) {
                data.succes.should.be.false;
                
                var message = data.message;
                should.exist(message);
                message.should.be.equal('Authentication fail');
                
                should.not.exist(data.user);
            })
        });
    });
    
    describe('* setCredentials', function() {
        it('should store the given user in scope and store', function() {
           AuthenticationService.setCredentials({
               username: 'test',
               token: 'tok3n'
           });
           
           var globals = rootScope.globals;
           should.exist(globals);
           should.exist(globals.user);
           globals.user.username.should.be.equal('test');
           globals.user.token.should.be.equal('tok3n');
           should.exist(globals.token);
           globals.token.should.be.equal('tok3n');
           
           should.exist(cookieStore.get('globals'));
           cookieStore.get('globals').should.eql(globals);
        });
    });
    
    describe('* clearCredentials()', function() {
        it('should clean credentials', function() {

            AuthenticationService.clearCredentials();
            
            should.exist(rootScope.globals); 
            rootScope.globals.should.eql({});
            
            should.not.exist(cookieStore.get('globals'))
        });
    });
});