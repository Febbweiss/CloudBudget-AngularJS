describe('GlobalController', function() {
    
    var $location,
        $rootScope,
        $scope,
        createController,
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
    
    beforeEach(inject(function ( _$rootScope_, $controller, _$location_) {
        $location = _$location_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        
        createController = function() {
            return $controller('GlobalController', {
                '$scope': $scope,
                '$location': $location,
                '$rootScope': $rootScope
            });
        };
    }));
    
    it('should init successfully', inject(function($location, $rootScope) {
        var globalController = createController();
        globalController.current_account = '560a84058812ad8d0ff200ee';
        globalController.change_account();
        $location.path().should.be.equal('/account/560a84058812ad8d0ff200ee')
    }));

});