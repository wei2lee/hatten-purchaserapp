

angular.module('starter.controllers', [])

.controller('AppCtrl', function ($rootScope, $scope, $ionicModal, $timeout, u, apiUser) {
})

.controller('WhatsNewCtrl', function ($scope, $interval, u, apiWhatsNewItem) {
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
        
        $interval.cancel($scope.updateExpireRemainInterval);
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
        if(state.direction != 'back') {
            ionic.Platform.ready(function(){
                u.showProgress();
                apiWhatsNewItem.getAll().then(function(results) {
                    $scope.news = results;  
                    $scope.startUpdateExpireRemain(); 
                }).catch(function(error) {

                }).finally(function() {
                     u.hideProgress();
                });
            });
        }
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
    });
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        $scope.stopUpdateExpireRemain();
    });
})

.controller('PurchasedPropertiesCtrl', function ($scope, u, apiPurchasedProperty) {
    $scope.purchasedProperties = [];
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            u.showProgress();
            apiPurchasedProperty.getAll().then(function(results) {
                $scope.purchasedProperties = results;  
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})

.controller('PurchasedPropertyDetailCtrl', function ($scope, u, $state, apiPurchasedProperty) {
    $scope.purchasedProperty = undefined;
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        $scope.contentAnimated = false;
        if(state.direction != 'back') {  
            $scope.contentReady = false;
            u.showProgress();
            apiPurchasedProperty.getById($state.params.id).then(function(results) {
                $scope.purchasedProperty = results;
                $scope.project = results.project;
                $scope.unit = results.unit;
                $scope.consultant = results.consultant;
                $scope.contentAnimated = true;
                $scope.contentReady = true;
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})

.controller('TicketsCtrl', function ($scope, u, $state, apiTicket) {
    $scope.tickets = [];
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            u.showProgress();
            apiTicket.getAll().then(function(results) {
                $scope.tickets = results;  
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})

.controller('TicketCtrl', function ($scope, u, $state, apiTicket) {
    $scope.ticket = undefined;
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            u.showProgress();
            apiTicket.getById($state.params.id).then(function(results) {
                $scope.ticket = results;  
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})

.controller('ConstructionsCtrl', function ($scope, u, $state, apiConstruction) {
    $scope.constructions = [];
    $scope.tabIndex = 0;
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            u.showProgress();
            apiConstruction.getAll().then(function(results) {
                $scope.constructions = results;  
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})

.controller('ConstructionDetailCtrl', function ($scope, u, $state, apiConstruction) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            u.showProgress();
            apiConstruction.getById($state.params.id).then(function(results) {
                $scope.project = results.project;
                $scope.construction = results;
                $scope.progresses = results.progresses;
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})


.controller('PropertiesCtrl', function ($scope, u, $state, apiProperty) {
    $scope.properties = [];
    $scope.tabIndex = 0;
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            u.showProgress();
            apiProperty.getAll().then(function(results) {
                $scope.properties = results;
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})

.controller('PropertyDetailCtrl', function ($timeout, $q, $interval, $scope, u, $state, apiProperty, $timeout,intent) {
    $element = $('#propertydetail');
    $content = $element.find('ion-content .content');
    console.log("$content.length = "+$content.length);
    console.log($content.get(0));
    
    $scope.rate = {
        title:'Rate this Property',
        setRate:function(i) {
            var oldval = Math.floor($scope.rate.rate);
            if(oldval == i && oldval > 1) {
                $scope.rate.rate = oldval - 1;
            }else{
                $scope.rate.rate = i;
            }
            var newval = $scope.rate.rate;
            if(oldval != newval) {
                if($scope.onSetRate)   
                    $scope.onSetRate(newval)
            }
        },
        rate:_.random(10,50)/10,
        review: {
            averageRate:_.random(10,50)/10,
            totalPeople:_.random(1000),
            totalRatePerStars:[_.random(200),_.random(200),_.random(200),_.random(200),_.random(200)],
            getTotalRateStars:function() { return _.max(this.totalRatePerStars); },
            getChartWidth:function(i) { return (this.totalRatePerStars[i] / this.getTotalRateStars()) * 100 + '%'; }
        }
    };
    $scope.rate.review.totalPeople = _.reduce($scope.rate.review.totalRatePerStars, function(s,o){
        return s+o;
    });
    $content.addClass('contentNotReady');
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        $scope.contentAnimated = false;
        if(state.direction != 'back') {
            $scope.contentReady = false;
            
            
            $timeout(function(){
                $scope.contentAnimated = true;
                u.showProgress();
                console.log($scope.contentReady + new Date());
                apiProperty.getById($state.params.id).then(function(results) {
                    $scope.property = results;  
                    $scope.project = results;
                    u.imagesLoaded($element.find('img')).then(function(){ 
                        $timeout(function(){
                            $scope.contentReady = true;   
                            $content.removeClass('contentNotReady');
                            
                            console.log($content.get(0));
                        },50);
                    });
                }).catch(function(error) {

                }).finally(function() {
                     u.hideProgress();
                });
            },50);
        }
    });
})

.controller('PropertySpecificationCtrl', function ($scope, u, $state, apiProperty, $timeout) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
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

.controller('EventsCtrl', function ($scope, $interval, u, apiEvent) {
    $scope.events = [];
    $scope.tabIndex = 0;
    $scope.updateExpireRemainInterval = null;
    
    $scope.startUpdateExpireRemain = function() {
        if($scope.updateExpireRemainInterval) return;
        
        $scope.updateExpireRemainInterval = $interval(function() {
            $scope.updateExpireRemain();
        },500);
    }
    
    $scope.stopUpdateExpireRemain = function() {
        if(!$scope.updateExpireRemainInterval) return;
        $interval.cancel($scope.updateExpireRemainInterval);
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
    
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        $scope.startUpdateExpireRemain(); 
        if(state.direction != 'back') {
            u.showProgress();
            apiEvent.getAll().then(function(results) {
                $scope.events = results;
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        $scope.startUpdateExpireRemain(); 
    });
    $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
    });
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        $scope.stopUpdateExpireRemain();
    });
})

.controller('EventDetailCtrl', function ($timeout, $scope, u, $state, apiEvent, apiTicket) {
    $scope.rate = {
        title:'Rate this Event',
        setRate:function(i) {
            var oldval = Math.floor($scope.rate.rate);
            if(oldval == i && oldval > 1) {
                $scope.rate.rate = oldval - 1;
            }else{
                $scope.rate.rate = i;
            }
            var newval = $scope.rate.rate;
            if(oldval != newval) {
                if($scope.onSetRate)   
                    $scope.onSetRate(newval)
            }
        },
        rate:_.random(10,50)/10,
        review: {
            averageRate:_.random(10,50)/10,
            totalPeople:_.random(1000),
            totalRatePerStars:[_.random(200),_.random(200),_.random(200),_.random(200),_.random(200)],
            getTotalRateStars:function() { return _.max(this.totalRatePerStars); },
            getChartWidth:function(i) { return (this.totalRatePerStars[i] / this.getTotalRateStars()) * 100 + '%'; }
        }
    };
    $scope.rate.review.totalPeople = _.reduce($scope.rate.review.totalRatePerStars, function(s,o){
        return s+o;
    });
    
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
        $scope.contentAnimated = false;
        if(state.direction != 'back') {
            $scope.contentReady = false;
            u.showProgress();
            $timeout(function(){
                apiEvent.getById($state.params.id).then(function(results) {
                    $scope.event = results;
                    $scope.contentAnimated = true;
                    $timeout(function(){
                        $scope.contentReady = true;
                    },50);
                }).catch(function(error) {

                }).finally(function() {
                     u.hideProgress();
                });
            },50);
        }
    });
})

.controller('ConsultantsCtrl', function ($scope, u, $state, apiProject, apiConsultant) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            u.showProgress();
            apiProject.getAll().then(function(results) {
                $scope.projects = results;
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})

.controller('ConsultantsWhereProjectCtrl', function ($scope, $q, u, $state, apiConsultant, apiProject) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            u.showProgress();
            $q.all([apiConsultant.getByProjectId($state.params.projectId), 
                    apiProject.getById($state.params.projectId)]).then(function(results) {
                $scope.consultants = results[0];
                $scope.project = results[1];
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})

.controller('ConsultantDetailCtrl', function ($scope, u, $state, apiConsultant) {
    $scope.rate = {
        title:'Rate this Consultant',
        setRate:function(i) {
            var oldval = Math.floor($scope.rate.rate);
            if(oldval == i && oldval > 1) {
                $scope.rate.rate = oldval - 1;
            }else{
                $scope.rate.rate = i;
            }
            var newval = $scope.rate.rate;
            if(oldval != newval) {
                if($scope.onSetRate)   
                    $scope.onSetRate(newval)
            }
        },
        rate:_.random(10,50)/10,
        review: {
            averageRate:_.random(10,50)/10,
            totalPeople:_.random(1000),
            totalRatePerStars:[_.random(200),_.random(200),_.random(200),_.random(200),_.random(200)],
            getTotalRateStars:function() { return _.max(this.totalRatePerStars); },
            getChartWidth:function(i) { return (this.totalRatePerStars[i] / this.getTotalRateStars()) * 100 + '%'; }
        }
    };
    $scope.rate.review.totalPeople = _.reduce($scope.rate.review.totalRatePerStars, function(s,o){
        return s+o;
    });
    
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = false;
            u.showProgress();
            apiConsultant.getById($state.params.id).then(function(results) {
                console.log(results);
                $scope.consultant = results;
                $scope.contentReady = true;
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
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

.controller('LearnMoreCtrl', function ($scope, intent) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        $scope.item = intent.item;
    });
})



;