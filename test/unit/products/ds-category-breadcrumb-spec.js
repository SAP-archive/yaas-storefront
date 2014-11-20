/**
 * Created by i839794 on 11/19/14.
 */

describe('directive: ds-category-breadcrumb', function() {
    var scope,
        element;


    beforeEach(module('ds.products'));

    beforeEach(inject(function($rootScope, $compile) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        scope = $rootScope.$new();

        element =
            angular.element('<ds-category-breadcrumb linklast=\"true\"/>');
        scope.category = {path:[{name:'bottles', slug: 'bslug', id:1}, {name: 'containers', slug: 'cslug', id:2}], name:'bottles', id: 4};
        $compile(element)(scope);
        scope.$digest();
    }));

    it('should create a set of category links', function(){
        var text = element.text();
        expect(text).toEqualData('All Products / bottles / containers');
        var all = element.find('#bc0');
        var html = '<div class=\"ng-scope\"><a ui-sref=\"base.category({catName: null})\" id=\"bc0\">All Products</a> / <a ui-sref=\"base.category({catName: \'bslug\' })\" id=\"bc1\">bottles</a> / <a ui-sref=\"base.category({catName: \'cslug\' })\" id=\"bc2\">containers</a></div>';
        expect(element.html()).toEqualData(html);
    });
});
