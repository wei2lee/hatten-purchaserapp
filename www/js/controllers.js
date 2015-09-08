

angular.module('starter.controllers', [])

.controller('AppCtrl', function ($rootScope, $scope, $ionicModal, $timeout, u, apiUser) {
})

.controller('WhatsNewCtrl', function ($scope, u, $timeout, $ionicScrollDelegate, apiWhatsNewItem) {
    $element = $('#whatsnew');
    $content = $element.find('ion-content .content');
    $scope.timer = u.createTimer(function() {
        for(i = 0 ; i < $scope.news.length ; i++) {
            var _new = $scope.news[i];
            var remainSeconds = Math.max(Math.floor((_new.expireDate.getTime() - new Date().getTime()) / 1000), 0);
            var dd = Math.floor(remainSeconds / (60*60*24));
            var hh = Math.floor(remainSeconds / (60*60)) % 24;
            var mi = Math.floor(remainSeconds / (60)) % 60;
            var ss = remainSeconds % 60;
            _new.expireRemain = sprintf("%d:%02d:%02d:%02d", dd, hh, mi, ss);
        }
    });
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            ionic.Platform.ready(function(){
                $scope.news = [];
                u.showProgress();
                apiWhatsNewItem.getAll().then(function(results) {
                    $scope.news = results;  
                    $scope.timer.start(); 
                    return $timeout(function(){
                        u.imagesLoaded($content.find('img').slice(0,2));
                    });
                }).then(function(){
                    return $timeout(function(){
                        $scope.contentReady = true;
                        $scope.contentAnimated = true;
                    },200);
                }).catch(function(error) {

                }).finally(function() {
                     u.hideProgress();
                });
            });
        }else{
            $scope.timer.start();  
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        $scope.timer.stop();
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
            $ionicScrollDelegate.scrollTop(false);
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})


.controller('EventsCtrl', function ($scope, u, $timeout, apiEvent) {
    $element = $('#events');
    $content = $element.find('ion-content .content');
    $scope.timer = u.createTimer(function() {
        for(i = 0 ; i < $scope.events.length ; i++) {
            var _new = $scope.events[i];
            var remainSeconds = Math.max(Math.floor((_new.expireDate.getTime() - new Date().getTime()) / 1000), 0);
            var dd = Math.floor(remainSeconds / (60*60*24));
            var hh = Math.floor(remainSeconds / (60*60)) % 24;
            var mi = Math.floor(remainSeconds / (60)) % 60;
            var ss = remainSeconds % 60;
            _new.expireRemain = sprintf("%d:%02d:%02d:%02d", dd, hh, mi, ss);
        }
    });
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        $scope.timer.start(); 
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.events = [];
            $scope.tabIndex = 0;
            u.showProgress();
            apiEvent.getAll().then(function(results) {
                $scope.events = results;
                $scope.timer.start();
                return $timeout(function(){
                    u.imagesLoaded($content.find('img').slice(0,2));
                });
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                });
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }else{
            $scope.timer.start();
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        $scope.timer.stop();
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('EventDetailCtrl', function ($scope, u, $timeout, $state, apiEvent, apiTicket) {
    $element = $('#eventdetail');
    $content = $element.find('ion-content .content');
    $scope.rate = u.createRate();
    $scope.attempEvent = function(event) {
        u.showProgress();
        apiTicket.addByEvent(event).then(function(results) {
            u.showAlert('Ticket for this event is added.');
        }).catch(function(error) {
        }).finally(function() {
             u.hideProgress();
        });
    }
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.event = null;
            u.showProgress();
            apiEvent.getById($state.params.id).then(function(results) {
                $scope.event = results;
                return $timeout(function(){
                    u.imagesLoaded($content.find('img').slice(0,2));
                });
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('PurchasedPropertiesCtrl', function ($scope, u, $timeout, $ionicScrollDelegate, apiPurchasedProperty) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            
            $scope.purchasedProperties = [];
            u.showProgress();
            apiPurchasedProperty.getAll().then(function(results) {
                $scope.purchasedProperties = results;  
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                });
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
            $ionicScrollDelegate.scrollTop(false);
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('PurchasedPropertyDetailCtrl', function ($scope, u, $timeout, $state, apiPurchasedProperty) {
    $element = $('#purchasedpropertydetail');
    $content = $element.find('ion-content .content');
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {  
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            
            $scope.purchasedProperty = null;
            $scope.project = null;
            $scope.unit = null;
            $scope.consultant = null;
            u.showProgress();
            apiPurchasedProperty.getById($state.params.id).then(function(results) {
                $scope.purchasedProperty = results;
                $scope.project = results.project;
                $scope.unit = results.unit;
                $scope.consultant = results.consultant;
                return $timeout(function(){
                    u.imagesLoaded($content.find('img').slice(0,2));
                });
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {

            }).finally(function() {
                console.log('finally');
                 u.hideProgress();
            });
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('TicketsCtrl', function ($scope, u, $timeout, $state, apiTicket) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.tickets = [];
            u.showProgress();
            apiTicket.getAll().then(function(results) {
                $scope.tickets = results;  
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('TicketCtrl', function ($scope, u, $state, apiTicket) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.ticket = null;
            u.showProgress();
            apiTicket.getById($state.params.id).then(function(results) {
                $scope.ticket = results;  
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('ConstructionsCtrl', function ($scope, u, $timeout, $state, apiConstruction) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.constructions = [];
            $scope.tabIndex = 0;
            u.showProgress();
            apiConstruction.getAll().then(function(results) {
                $scope.constructions = results;  
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {
            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('ConstructionDetailCtrl', function ($scope, u, $timeout, $state, apiConstruction) {
    $element = $('#constructiondetail');
    $content = $element.find('ion-content .content');
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.project = null;
            $scope.construction = null;
            $scope.progresses = [];
            u.showProgress();
            apiConstruction.getById($state.params.id).then(function(results) {
                $scope.project = results.project;
                $scope.construction = results;
                $scope.progresses = results.progresses;
                return $timeout(function(){
                    u.imagesLoaded($content.find('img').slice(0,2));
                });
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})


.controller('PropertiesCtrl', function ($scope, u, $timeout, $state, apiProperty) {
    $element = $('#constructiondetail');
    $content = $element.find('ion-content .content');
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.properties = [];
            $scope.tabIndex = 0;
            u.showProgress();
            apiProperty.getAll().then(function(results) {
                $scope.properties = results;
                return $timeout(function(){
                    u.imagesLoaded($content.find('img').slice(0,2));
                });
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('PropertyDetailCtrl', function ($scope, u, $timeout, $state, apiProperty) {
    $element = $('#propertydetail');
    $content = $element.find('ion-content .content');
    $scope.rate = u.createRate();
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.property = null;
            $scope.project = null;
            u.showProgress();
            apiProperty.getById($state.params.id).then(function(results) {
                $scope.property = results;  
                $scope.project = results;
                return $timeout(function(){
                    u.imagesLoaded($element.find('img'));
                });
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {
            }).finally(function() {
                u.hideProgress();
            });
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('PropertySpecificationCtrl', function ($scope, u, $timeout, $state, apiProperty, $timeout) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.property = null; 
            u.showProgress();
            apiProperty.getById($state.params.id).then(function(results) {
                $scope.property = results;  
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})


.controller('ConsultantsCtrl', function ($scope, u, $timeout, $state, apiProject, apiConsultant) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.projects = [];
            u.showProgress();
            apiProject.getAll().then(function(results) {
                $scope.projects = results;
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('ConsultantsWhereProjectCtrl', function ($scope, u, $timeout, $state, $q, apiConsultant, apiProject) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.consultants = [];
            $scope.project = null;
            u.showProgress();
            $q.all([apiConsultant.getByProjectId($state.params.projectId), 
                    apiProject.getById($state.params.projectId)]).then(function(results) {
                $scope.consultants = results[0];
                $scope.project = results[1];
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('ConsultantDetailCtrl', function ($scope, u, $state, $timeout, apiConsultant) {
    $element = $('#consultantdetail');
    $content = $element.find('ion-content .content');
    $scope.rate = u.createRate();
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.consultant = null;
            u.showProgress();
            apiConsultant.getById($state.params.id).then(function(results) {
                console.log(results);
                $scope.consultant = results;
                return $timeout(function(){
                    u.imagesLoaded($content.find('img').slice(0,2));
                });
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('CalculatorCtrl', function ($scope) {
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
    $scope.purchaseprice = '';
    $scope.downpayment = '';
    $scope.loanrate = '';
    $scope.tenureyear = '';    
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = true;
            $scope.contentAnimated = true;
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('LearnMoreCtrl', function ($scope, intent) {
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.item = intent.item;
            $scope.contentReady = true;
            $scope.contentAnimated = true;
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('AboutDetailCtrl', function($scope, u, $timeout) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = true;
            $scope.contentAnimated = true;
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('AboutUsCtrl', function($scope, u, $timeout) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = true;
            $scope.contentAnimated = true;
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('ProfileCtrl', function($scope, u, $timeout) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = true;
            $scope.contentAnimated = true;
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('TNCCtrl', function($scope, u, $timeout) {
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = true;
            $scope.contentAnimated = true;
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('PolicyCtrl', function($scope, u, $timeout) {
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = true;
            $scope.contentAnimated = true;
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('PDPACtrl', function($scope, u, $timeout) {
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = true;
            $scope.contentAnimated = true;
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})





;