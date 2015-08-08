angular.module('starter.controllers', [])

.controller('AppCtrl', function ($rootScope, $scope, $ionicModal, $timeout, u) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $rootScope.u = u;

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('WhatsNewCtrl', function ($scope, $interval, u) {
    $scope.news = [];
    $scope.updateExpireRemainInterval = null;
    
    $scope.startUpdateExpireRemain = function() {
        if($scope.updateExpireRemainInterval) return;
        
        $scope.updateExpireRemainInterval = $interval(function() {
            $scope.updateExpireRemain();
        },500);
    }
    
    $scope.stopUpdateExpireRemain = function() {
        if(!$scope.updateExpireRemainInterval) return;
        
        $scope.updateExpireRemainInterval.cancel();
    }
    
    $scope.updateExpireRemain = function() {
        for(i = 0 ; i < $scope.news.length ; i++) {
            var _new = $scope.news[i];
            var expireRemainTimeInterval = Math.max(Math.floor((_new.expireDate.getTime() - new Date().getTime()) / 1000), 0);
            var dd = Math.floor(expireRemainTimeInterval / (60*60*24));
            var hh = Math.floor(expireRemainTimeInterval / (60*60)) % 24;
            var mi = Math.floor(expireRemainTimeInterval / (60)) % 60;
            var ss = expireRemainTimeInterval % 60;
            _new.expireRemain = dd + ' Days ' + hh + ' Hours ' + mi + ' Minute ' + ss + ' Seconds';
        }
    }
    
    $scope.$on('$ionicView.beforeEnter ', function (viewInfo, state) {
        console.log('CTRL - $ionicView.beforeEnter', viewInfo, state);
        $scope.startUpdateExpireRemain(); 
    });
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        console.log('CTRL - $ionicView.afterEnter', viewInfo, state);
        $scope.startUpdateExpireRemain(); 
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        console.log('CTRL - $ionicView.beforeLeave', viewInfo, state);
    });
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        console.log('CTRL - $ionicView.afterLeave', viewInfo, state);
        $scope.stopUpdateExpireRemain();
    });
    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        console.log('CTRL - $ionicView.loaded', viewInfo, state);
        
        //Dummy Start
        for(i = 0 ; i < 10 ; i++) {
            var value = {};
            value.thumb = faker.image.city();
            value.period = '12-14 JUNE, 11pm-5pm';
            value.displayName = faker.company.companyName();
            value.expireDate = faker.date.future();
            value.expireRemain = '7 Days 9 Hrs 0min';
            $scope.news.push(value);
        }
        //Dummy End
    });
})

.controller('PurchasedPropertiesCtrl', function ($scope) {
    $scope.purchasedProperties = [];
    
    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        console.log('CTRL - $ionicView.loaded', viewInfo, state);
        //Dummy Start
        for(i = 0 ; i < 10 ; i++) {
            var value = {};
            value.thumb = faker.image.city();
            value.displayName = faker.company.companyName();
            value.project = {
                displayName : 'Harbour City'
            };
            value.area = faker.address.state();
            value.unitNo = 'A-01-03';
            value.unitId = '123';
            value.completionDate = faker.date.future();
            value.purchasedDate = faker.date.past();
            value.location = {
                latitude : '',
                longitude : ''
            }
            $scope.purchasedProperties.push(value);
        }
        //Dummy End
    });
    

})

.controller('PurchasedPropertyDetailCtrl', function ($scope, $state) {
    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        console.log('CTRL - $ionicView.loaded', viewInfo, state);
        //Dummy Start
        $scope.purchasedProperty = {
            project: {
                displayName:'Harbour City',
                thumb:faker.image.city()
            },
            displayName: '',
            unitNo:'A-01-03',
            completionDate: '20 Dec 2015'
        };
        console.log($scope.purchasedProperty);
        //Dummy End
    });
})

.controller('ConstructionsCtrl', function ($scope, $state) {
    $scope.constructions = [];
    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        console.log('CTRL - $ionicView.loaded', viewInfo, state);
        //Dummy Start
        for(i = 0 ; i < 30 ; i++) {
            $scope.constructions.push(
            {
                id:i,
                displayName: faker.company.companyName(),
                thumb:faker.image.city(),
                type:Math.floor(Math.random() * 3)
            });
        }
        console.log($scope.constructions);
        //Dummy End
    });
})

.controller('ConstructionDetailCtrl', function ($scope, $state) {
    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        console.log('CTRL - $ionicView.loaded', viewInfo, state);
        //Dummy Start
        $scope.project = {
            id:1,
            displayName: faker.company.companyName(),
            thumb:faker.image.city()
        };

        $scope.construction = {
            id:1,
            displayName: faker.company.companyName(),
            thumb:faker.image.city()
        };

        $scope.progresses = [];
        for(i = 0 ; i < 10 ; i++) {
            $scope.progresses.push(
            {
                id:i,
                photoTakenDate: '25 June 2015',
                thumb:faker.image.transport()
            });
        }

        console.log($scope.construction);
        //Dummy End
    });
})


.controller('PropertiesCtrl', function ($scope, $state) {
    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        console.log('CTRL - $ionicView.loaded', viewInfo, state);
        //Dummy Start
        $scope.properties = [];
        for(i = 0 ; i < 10 ; i++) {
            $scope.properties.push(
            {
                id:i,
                displayName: faker.company.companyName(),
                thumb:faker.image.city()
            });
        }
        //Dummy End
    });
})


.controller('PropertyDetailCtrl', function ($scope, $state) {
    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        //Dummy Start
        console.log('CTRL - $ionicView.loaded', viewInfo, state);
        $scope.project = {
            thumb:faker.image.city()   
        }
        $scope.property = {
            thumb:faker.image.city(),
            description:faker.lorem.paragraphs(),
            displayName:faker.company.companyName()

        }
        //Dummy End
    });
})

;