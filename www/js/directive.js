angular.module('directive', ['ionic'])
.directive('rateWidget', function () {
    return {
        templateUrl: 'templates/common/rate-review.html',
        replace: true,
        scope: {
            rate:'=rate'
        },
        link: function (scope, element, attrs, ctrls) {
        }
    };
})

.directive('preloadThumb', function() {
    return {
        link: function (scope, element, attrs, ctrls) {
            
            alert(1);
            
            
        }
    }
})

;