describe('MainMediaExtractor', function () {

    beforeEach(angular.mock.module('ds.shared'));

    it('should return undefined if media is not an array', angular.mock.inject(function (MainMediaExtractor) {
        // arrange
        var media = null;

        // act
        var mainMedia = MainMediaExtractor.extract(media);

        // assert
        expect(mainMedia).toEqual(undefined);
    }));

    it('should extract main media', angular.mock.inject(function (MainMediaExtractor) {
        // arrange
        var media = [
            { id: 'media-1' },
            { id: 'media-2', uncommittedMedia: true },
            { id: 'media-3', uncommittedMedia: false }
        ];

        // act
        var mainMedia = MainMediaExtractor.extract(media);

        // assert
        expect(mainMedia).toEqual({ id: 'media-1' });
    }));
});