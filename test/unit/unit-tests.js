/*
unit tests will go here
*/

describe('Product services: ', function () {

  beforeEach(function() {
    this.addMatchers({
        toEqualData: function(expected) {
          return angular.equals(this.actual, expected);
      }
    });
  });

  beforeEach(module('ds.shared'));
  beforeEach(module('ds.products'));

  describe('BrowseProductsCtrl', function () {
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller, caas) {
      $httpBackend = _$httpBackend_;

      scope = $rootScope.$new();

      ctrl = $controller('BrowseProductsCtrl', {
        $scope: scope,
        caas: caas
      });

      $httpBackend.whenGET('http://localhost:9000/#!/products/')
        .respond({"products": [{name: 'Shirt'}, {name: 'Hat'}]});

      // Need to mock these responses because of ui-router
      // See this OPEN issue for more info: https://github.com/angular-ui/ui-router/issues/212
      $httpBackend.whenGET('public/js/app/shared/templates/navigation.html').respond({});
      $httpBackend.whenGET('public/js/app/shared/templates/header.html').respond({});
      $httpBackend.whenGET('public/js/app/shared/templates/footer.html').respond({});
      $httpBackend.whenGET('public/js/app/home/templates/body.html').respond({});

    }));

    it('should have an initial list of products', function() {
      $httpBackend.expectGET('http://localhost:9000/#!/products/')
        .respond({"products": [{name: 'Shirt'}, {name: 'Hat'}]});

      $httpBackend.flush();
      expect(scope.result).toEqualData({"products":[{name: 'Shirt'}, {name: 'Hat'}]});
    });

  });

});
