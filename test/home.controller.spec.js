describe('HomeController', function() {
    
    var rootScope;
    
    beforeEach(module('cloudbudget'));
    
    beforeEach(inject(function($rootScope) {
        rootScope = $rootScope.$new();
    }));
    
    describe('getFullname()', function() {
        it('should handle names correctly', inject(function($controller) {
            var scope = {};
            var homeController = $controller('HomeController', {
                '$rootScope': rootScope
            });

            homeController.firstname = 'George';
            homeController.lastname = 'Harrison';
            homeController.getFullname().should.be.equal('George Harrison');
        }));
    });
});