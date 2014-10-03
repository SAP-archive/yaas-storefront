/**
 * Created by i839794 on 9/30/14.
 */
'use strict';

angular.module('ds.shared').filter('encodeURIComponent', function() {
    return window.encodeURIComponent;
});
