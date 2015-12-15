describe('forceScroll directive', function () {

    beforeEach(module('ds.shared'));

    var $compile, $rootScope, $scope;

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_; 
    }));

    function enterThePage(){
        $scope = $rootScope.$new();
        $compile('<!-- directive: force-scroll -->')($scope);        
    };

    function leaveThePage(){
        $scope.$destroy();       
    };

    it("should show scroll when entering the page", function () {
        enterThePage();
        expect($rootScope.forceScroll).toBe(true);
    });

    it("should hide scroll when leaving the page", function () {
        enterThePage();
        expect($rootScope.forceScroll).toBe(true);
        
        leaveThePage();
        expect($rootScope.forceScroll).toBe(false);
    });
});