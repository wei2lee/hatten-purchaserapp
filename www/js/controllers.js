

angular.module('starter.controllers', [])

.controller('AppCtrl', function ($rootScope, $scope, $ionicModal, $timeout, u, apiUser) {
    $scope.hello = function() {
        console.log('hello');   
    }
    $scope.app = 'Application';
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
            //Expring: 00days:00hrs:00mins
//            _new.expireRemain = sprintf("%d:%02d:%02d:%02d", dd, hh, mi, ss);
            _new.expireRemain = sprintf("%ddays:%02dhrs:%02dmins", dd, hh, mi);
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
                    u.showAlert(error.description);
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


.controller('EventsCtrl', function ($scope, u, $timeout, $ionicScrollDelegate, apiEvent) {
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
            _new.expireRemain = sprintf("%ddays:%02dhrs:%02dmins", dd, hh, mi);
//            _new.expireRemain = sprintf("%d:%02d:%02d:%02d", dd, hh, mi, ss);
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
                u.showAlert(error.description);
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
            $ionicScrollDelegate.scrollTop(false);
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
                u.showAlert(error.description);
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

.controller('PurchasedPropertiesCtrl', function ($scope, u, $timeout, $q, $state, $ionicScrollDelegate, apiPurchasedProperty,apiUser) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.units = [];
            var waitLogin;
            if(apiUser.getUser()) {
                waitLogin = $q(function(resolve,reject){ resolve(); });
            }else{
                waitLogin = u.openLogin().catch(function(){
                    throw createError('You must login before browsing purchased unit(s)');
                });   
            }
            waitLogin.then(function() {
                u.showProgress();
                apiPurchasedProperty.getAll().then(function(results) {
                    $scope.units = results;  
                }).then(function(){
                    return $timeout(function(){
                        $scope.contentReady = true;
                        $scope.contentAnimated = true;
                    });
                }).catch(function(error) {
                    u.showAlert(error.description);
                }).finally(function() {
                    u.hideProgress();
                });
            }).catch(function(error){
                u.showAlert(error.description).then(function(){
                    $state.go('app.whatsnew');
                });
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

.controller('PurchasedPropertyDetailCtrl', function ($scope, u, $timeout, $state, apiPurchasedProperty, apiConsultant) {
    $element = $('#purchasedpropertydetail');
    $content = $element.find('ion-content .content');
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {  
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.unit = null;
            $scope.agent = null;
            u.showProgress();
            apiPurchasedProperty.useCache().getById($state.params.id).then(function(results) {
                $scope.unit = results;
                apiConsultant.getByUnitId(results.UnitId).then(function(results) {
                    $scope.agent = _.first(results);                                                    
                }).catch(function(error) {
                    u.showAlert(error.description);
                })
                return $timeout(function(){
                    u.imagesLoaded($content.find('img').slice(0,2));
                });
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {
                u.showAlert(error.description);
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

.controller('UnitFloorplanCtrl', function ($scope, u, $q, $timeout, $state, apiProjectUnitType, apiProjectUnitFloor) {
    $element = $('#floorplan');
    $content = $element.find('ion-content .content');
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.property = null; 
            u.showProgress();
            $q.all([
                apiProjectUnitFloor.getByUnitId($state.params.id), 
                apiProjectUnitType.getByUnitId($state.params.id)]).then(function(results) {
                $scope.keyFloorplan = results[0][0];
                $scope.unitFloorplan = results[1];
                $svg = $content.find('.svg-container').empty().append($scope.keyFloorplan.FloorSvg);
                SVG.select('svg>g>*').fill('#ffffff');
                var selector = '#'+$scope.unitFloorplan.UnitNo+'>*';
                SVG.select(selector).fill('#ff0000');
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {
                u.showAlert(error.description);
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
                u.showAlert(error.description);
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
                u.showAlert(error.description);
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

.controller('ConstructionsCtrl', function ($scope, u, $timeout, $state, apiProject) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.constructions = [];
            $scope.tabIndex = 'COMMERCIAL';
            u.showProgress();
            apiProject.getAll().then(function(results) {
                $scope.projects = results;  
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {
                u.showAlert(error.description);
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

.controller('ConstructionDetailCtrl', function ($scope, u, $timeout, $state, apiProject) {
    $element = $('#constructiondetail');
    $content = $element.find('ion-content .content');
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.project = null;
            u.showProgress();
            apiProject.useCache().getById($state.params.id).then(function(results) {
                $scope.project = results;
                return $timeout(function(){
                    u.imagesLoaded($content.find('img').slice(0,2));
                });
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {
                u.showAlert(error.description);
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


.controller('PropertiesCtrl', function ($scope, u, $timeout, $state, apiProperty, $ionicScrollDelegate) {
    $element = $('#constructiondetail');
    $content = $element.find('ion-content .content');
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.properties = [];
            $scope.tabIndex = 'COMMERCIAL';
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
                u.showAlert(error.description);
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

.controller('PropertyDetailCtrl', function ($scope, u, $timeout, $state, $rootScope, apiProperty,apiUser) {
    $element = $('#propertydetail');
    $content = $element.find('ion-content .content');
    $learnmore = $content.find('.learn-more-container');
    $scope.rate = u.createRate();
    $scope.rate.title = 'Rate this Property';
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.property = null;
            $scope.project = null;
            u.showProgress();
            apiProperty.useCache().getById($state.params.id).then(function(results) {
                $scope.property = results;  
                $scope.project = results
                $timeout(function(){
                    $scope.learnmoretooshort = $learnmore.height()<160;
                    console.log('learmore.height = ' + $learnmore.height() + ",learnmoretooshort="+$scope.learnmoretooshort);
                    
                });
                return $timeout(function(){
                    u.imagesLoaded($element.find('img'));
                });
            }).then(function(){
                $scope.rate.setRateFromProject($scope.property);  
                $scope.rate.getRateForProject($scope.property);
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {
                u.showAlert(error.description);
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

.controller('PropertySpecificationCtrl', function ($scope, u, $timeout, $state, apiProperty, $sce) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.property = null; 
            u.showProgress();
            apiProperty.useCache().getById($state.params.id).then(function(results) {
                $scope.url = results.ProjectSpec ? $sce.trustAsResourceUrl(results.ProjectSpec) : '';  
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {
                u.showAlert(error.description);
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

.controller('PropertyLocationCtrl', function ($scope, u, $timeout, $state, apiProperty, $sce) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if (state.direction != 'back') {
            $scope.url = '';
            u.showProgress();
            apiProperty.useCache().getById($state.params.id).then(function (results) {
                $scope.latitude = results.ProjectLat;
                $scope.longitude = results.ProjectLot;
                $scope.apiKey = 'AIzaSyAZU6hYAxURw1ewJYV4OMLitTYd01xPb0I';
                if($scope.latitude && $scope.longitude) {
                    
                    $scope.url = 
                        'https://www.google.com/maps/embed/v1/place'+
                        '?key='+$scope.apiKey+
                        '&q='+$scope.latitude+','+$scope.longitude+
                        '&zoom=18'
                    ;
                    console.log($scope.url);
                    $scope.url = $sce.trustAsResourceUrl($scope.url);
                    
                }else{
                    $scope.url = '';   
                }
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function (error) {
                u.showAlert(error.description);
            }).finally(function () {
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

.controller('PropertyGalleryCtrl', function ($scope, u, $timeout, $state, apiProperty) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.property = null; 
            u.showProgress();
            apiProperty.useCache().getById($state.params.id).then(function(results) {
                $scope.photos = _.sortBy(results.ProjectPhotos, 'Seq');
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {
                u.showAlert(error.description);
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

.controller('PropertyFloorplanCtrl', function ($scope, u, $timeout, $state, apiProjectUnitFloor, apiService) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.property = null; 
            u.showProgress();
            apiProjectUnitFloor.getByProjectId($state.params.id).then(function(results) {
                $scope.floorplans = results;
                $scope.floorplans = _.sortBy($scope.floorplans, 'Floor');
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {
                u.showAlert(error.description);
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
.controller('ConsultantsCtrl', function ($scope, u, $timeout, $state, apiProperty) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.properties = [];
            u.showProgress();
            apiProperty.getAll().then(function(results) {
                $scope.properties = results;
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {
                u.showAlert(error.description);
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
                    apiProject.useCache().getById($state.params.projectId)]).then(function(results) {
                $scope.consultants = results[0];
                $scope.project = results[1];
            }).then(function(){
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {
                u.showAlert(error.description);
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
    $scope.rate.title = 'Rate this Consultant';
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.consultant = null;
            u.showProgress();
            apiConsultant.getById($state.params.id).then(function(results) {
                $scope.consultant = results;
                return $timeout(function(){
                    u.imagesLoaded($content.find('img').slice(0,2));
                });
            }).then(function(){
                $scope.rate.setRateFromConsultant($scope.consultant);  
                $scope.rate.getRateForConsultant($scope.consultant);
                return $timeout(function(){
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                },200);
            }).catch(function(error) {
                u.showAlert(error.description);
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

.controller('WebCtrl', function($scope, u, intent, $sce) {
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = true;
            $scope.contentAnimated = true;
            $scope.item = intent.item;
            $scope.title = intent.item.title;
            $scope.url = intent.item.url ? $sce.trustAsResourceUrl(intent.item.url) : ''; 
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