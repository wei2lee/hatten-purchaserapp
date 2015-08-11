angular.module('services-api', [])

//API Service Start
.service('apiGetWhatsNewItem', function($q){
    this.get = function() {
        //dummy value start
        return $q(function(resolve, reject) {
            var values = [];
            resolve(values);
        });
        //dummy value end
    }
})

.service('apiGetUserPurchasedProperty', function($q){
    this.get = function() {
        //dummy value start
        return $q(function(resolve, reject) {
            var values = [];
            resolve(values);
        });
        //dummy value end
    }
})


//API Service End