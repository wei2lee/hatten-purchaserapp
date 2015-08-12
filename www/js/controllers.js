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
            //_new.expireRemain = dd + ' Days ' + hh + ' Hours ' + mi + ' Minute ' + ss + ' Seconds';
            _new.expireRemain = sprintf("%d:%02d:%02d:%02d", dd, hh, mi, ss);
        }
    }
    
    $scope.$on('$ionicView.beforeEnter ', function (viewInfo, state) {
        $scope.startUpdateExpireRemain(); 
    });
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        $scope.startUpdateExpireRemain(); 
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
    });
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        $scope.stopUpdateExpireRemain();
    });
    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        //Dummy Start
        for(i = 0 ; i < 10 ; i++) {
            var value = {};
            value.thumb = faker.image.event();
            value.period = '12-14 JUNE, 11pm-5pm';
            value.displayName = faker.company.companyName();
            value.expireDate = faker.date.future();
            value.expireRemain = '';
            value.favourited = _.random(1) == 0;
            $scope.news.push(value);
        }
        //Dummy End
    });
})

.controller('PurchasedPropertiesCtrl', function ($scope) {
    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        //Dummy Start
        $scope.purchasedProperties = [];
        for(i = 0 ; i < 10 ; i++) {
            var value = {};
            value.thumb = faker.image.property();
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
        //Dummy Start
        $scope.purchasedProperty = {
            project: {
                displayName:'Harbour City',
                thumb:faker.image.property()
            },
            displayName: '',
            unitNo:'A-01-03',
            completionDate: faker.date.future()
        };
        //Dummy End
    });
})

.controller('ConstructionsCtrl', function ($scope, $state) {
    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        $scope.constructions = [];
        $scope.tabIndex = 0;
        //Dummy Start
        for(i = 0 ; i < 30 ; i++) {
            $scope.constructions.push(
            {
                id:i,
                displayName: faker.company.companyName(),
                thumb:faker.image.property(),
                type:_.random(2)
            });
        }
        //Dummy End
    });
})

.controller('ConstructionDetailCtrl', function ($scope, $state) {
    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        //Dummy Start
        $scope.project = {
            id:1,
            displayName: faker.company.companyName(),
            thumb:faker.image.projectLogo()
        };

        $scope.construction = {
            id:1,
            displayName: faker.company.companyName(),
            thumb:faker.image.construction()
        };

        $scope.progresses = [];
        for(i = 0 ; i < 10 ; i++) {
            $scope.progresses.push(
            {
                id:i,
                photoTakenDate: faker.date.past(),
                thumb:faker.image.progress()
            });
        }
        //Dummy End
    });
})


.controller('PropertiesCtrl', function ($scope, $state) {
    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        $scope.tabIndex = 0;
        //Dummy Start
        $scope.properties = [];
        for(i = 0 ; i < 30 ; i++) {
            $scope.properties.push(
            {
                id:i,
                displayName: faker.company.companyName(),
                thumb:faker.image.property(),
                type:_.random(2)
            });
        }
        //Dummy End
    });
})

.controller('PropertyDetailCtrl', function ($scope, $state) {
    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        //Dummy Start
        $scope.project = {
            thumb:faker.image.projectLogo()   
        }
        $scope.property = {
            thumb:faker.image.property(),
            description:faker.lorem.paragraphs(),
            displayName:faker.company.companyName()
        }
        //Dummy End
    });
})

.controller('EventsCtrl', function ($scope, $interval, u) {
    $scope.events = [];
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
        for(i = 0 ; i < $scope.events.length ; i++) {
            var _event = $scope.events[i];
            var expireRemainTimeInterval = Math.max(Math.floor((_event.expireDate.getTime() - new Date().getTime()) / 1000), 0);
            var dd = Math.floor(expireRemainTimeInterval / (60*60*24));
            var hh = Math.floor(expireRemainTimeInterval / (60*60)) % 24;
            var mi = Math.floor(expireRemainTimeInterval / (60)) % 60;
            var ss = expireRemainTimeInterval % 60;
            //_new.expireRemain = dd + ' Days ' + hh + ' Hours ' + mi + ' Minute ' + ss + ' Seconds';
            _event.expireRemain = sprintf("%d:%02d:%02d:%02d", dd, hh, mi, ss);
        }
    }
    
    $scope.$on('$ionicView.beforeEnter ', function (viewInfo, state) {
        $scope.startUpdateExpireRemain(); 
    });
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        $scope.startUpdateExpireRemain(); 
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
    });
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        $scope.stopUpdateExpireRemain();
    });
    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        $scope.tabIndex = 0;
        //Dummy Start
        for(i = 0 ; i < 10 ; i++) {
            var value = {};
            value.id = i;
            value.thumb = faker.image.event();
            value.period = '12-14 JUNE, 11pm-5pm';
            value.displayName = faker.company.companyName();
            value.expireDate = faker.date.future();
            value.expireRemain = '';
            value.type = _.random(1);
            $scope.events.push(value);
        }
        //Dummy End
    });
})

.controller('EventDetailCtrl', function ($scope, $state) {
    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        //Dummy Start
        $scope.event = {
            thumb:faker.image.event(),
            description:faker.lorem.paragraphs(),
            displayName:faker.company.companyName(),
            period:'12-14 JUNE, 11pm-5pm',
            address:faker.address.streetAddress() + ', ' + faker.address.city() + ', ' + faker.address.state() + ', ' + faker.address.country(),
            location:{
                latitude:faker.address.latitude(),
                longitude:faker.address.longitude()
            },
            distance:sprintf("%.1f ", Math.random() * 100) + 'KM'
        }
        //Dummy End
    });
})

.controller('ConsultantsCtrl', function ($scope, $state) {
    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        $scope.projects = [];
        //Dummy Start
        for(i = 0 ; i < 10 ; i++) {
            $scope.projects.push(
            {
                id:i,
                displayName: faker.company.companyName(),
                thumb:faker.image.property()
            });
        }
        //Dummy End
    });
})

.controller('CalculatorCtrl', function ($scope) {
    $scope.$on('$ionicView.loaded', function (viewInfo, state) {

        $scope.purchaseprice = '';
        $scope.downpayment = '';
        $scope.loanrate = '';
        $scope.tenureyear = '';

        $scope.loanamount = function () {
            return this.purchaseprice - this.downpayment;
        };

        $scope.payablepermonth = function () {
            var ret = (this.interestpermonth() * this.effectiveinterest() * this.loanamount()) / (this.effectiveinterest() - 1);
            if (isNaN(ret)) ret = 0;
            return ret;
        };

        $scope.totalpayment = function () {
            return this.payablepermonth() * this.tenureyear * 12;
        };

        $scope.interestpermonth = function () {
            return this.loanrate / 100 / 12;
        };

        $scope.effectiveinterest = function () {
            return Math.pow(1 + this.interestpermonth(), this.tenureyear * 12);
        };

    });
})

;