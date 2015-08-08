angular.module('services', ['ngResource'])


//API Service Start
.service('apiGetWhatsNewItem', function($q){
    this.get = function() {
        //dummy value start
        return $q(function(resolve, reject) {
            var values = [];
            for(i = 0 ; i < 10 ; i++) {
                var value = {};
                value.thumb = faker.image.city();
                value.period = '12-14 JUNE, 11pm-5pm';
                value.displayName = faker.company.companyName();
                value.expireRemain = '7 Days 9 Hrs 0min';
                values.push(value);
            }
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
            for(i = 0 ; i < 10 ; i++) {
                var value = {};
                value.thumb = faker.image.city();
                value.displayName = faker.company.companyName();
                value.project = {
                    displayName : 'Harbour City'
                };
                value.unitNo = 'A-01-03';
                value.unitId = '123';
                value.completionDate = '2015 June 18';
                value.location = {
                    latitude : '',
                    longitude : ''
                }
                values.push(value);
            }
            resolve(values);
        });
        //dummy value end
    }
})


//API Service End


.service('u', function () {
    this.share = function (item) {
//        var message = undefined;
//        if(item.message) message = item.message;
//        else if(item.msg) message = item.msg; 
//        else if(item.description) message = item.description;
//        else if(item.desc) message = item.desc;
//        
//        var subject = undefined;
//        if(item.subject) subject = item.subject;
//        else if(item.title) subject = item.title;
//        else if(item.displayName) subject = item.displayName; 
//        else if(item.name) subject = item.name;
//        
//        var file = undefined;
//        if(item.image) file = item.image;
//        else if(item.thumb) file = item.thumb;
//        else if(item.thumbnail) file = item.thumbnail; 
//        else if(item.avatar) file = item.avatar;
//        
//        var link = undefined;
//        
//        $cordovaSocialSharing
//            .share(message, subject, file, link) // Share via native share sheet
//            .then(function (result) {
//                // Success!
//            }, function (err) {
//                // An error occured. Show a message to the user
//            });
    }
});