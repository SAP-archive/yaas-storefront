describe('CommittedMediaFilter', function () {

    beforeEach(angular.mock.module('ds.shared'));

    it('should throw if media is not an array', angular.mock.inject(function (CommittedMediaFilter) {
        // arrange
        var media = null;

        // act & assert
        expect(function () {
            CommittedMediaFilter.filter(media);
        }).toThrow();
    }));

    it('should filter only committed media', angular.mock.inject(function (CommittedMediaFilter) {
        // arrange
        var media = [
            { id: 'media-1' },
            { id: 'media-2', uncommittedMedia: true },
            { id: 'media-3', uncommittedMedia: false }
        ];

        // act
        var committedMedia = CommittedMediaFilter.filter(media);

        // assert
        expect(committedMedia).toEqual([
            { id: 'media-1' },
            { id: 'media-3', uncommittedMedia: false }
        ]);
    }));
});