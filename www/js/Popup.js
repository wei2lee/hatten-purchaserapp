(function () {
    var _module = angular.module('Popup', []);

    _module.factory('Popup', [
        '$ionicPopup',
        '$q',
        function ($ionicPopup, $q) {

            var firstDeferred = $q.defer();
            firstDeferred.resolve();

            var lastPopupPromise = firstDeferred.promise;

            return {
                'alert': function (object) {
                    var deferred = $q.defer();

                    lastPopupPromise.then(function () {
                        $ionicPopup.alert(object).then(function (res) {
                            deferred.resolve(res);
                        });
                    });

                    lastPopupPromise = deferred.promise;

                    return deferred.promise;
                }
            };
        }
    ])

})();