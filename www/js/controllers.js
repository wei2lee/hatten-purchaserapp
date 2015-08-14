

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
        if(state.direction != 'back') {
            u.showProgress();
            apiPurchasedProperty.getById($state.params.id).then(function(results) {
                $scope.purchasedProperty = results;  
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

.controller('ConstructionDetailCtrl', function ($scope, u, $state, apiConstructionProgress) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            u.showProgress();
            apiConstructionProgress.getByConstrucitonId($state.params.id).then(function(results) {
                $scope.project = results.project;
                $scope.construction = results.construction;
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

.controller('PropertyDetailCtrl', function ($scope, u, $state, apiProperty, $timeout) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            u.showProgress();
            apiProperty.getById($state.params.id).then(function(results) {
                $scope.property = results;  
                $scope.project = results.project;
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

.controller('EventDetailCtrl', function ($scope, u, $state, apiEvent, apiTicket) {
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
            u.showProgress();
            apiEvent.getById($state.params.id).then(function(results) {
                $scope.event = results;
            }).catch(function(error) {
                
            }).finally(function() {
                 u.hideProgress();
            });
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
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            u.showProgress();
            apiConsultant.getById($state.params.id).then(function(results) {
                console.log(results);
                $scope.consultant = results;
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

;