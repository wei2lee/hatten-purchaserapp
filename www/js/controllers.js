function EventsBaseController($scope, u, $timeout, $state, $ionicScrollDelegate, apiTicket, title, api) {
    $scope.title = title;
    $scope.eventTabs = [
//        {
//            'title':'Nov',
//            'events':[]
//        }
//    
    ];
    $scope.scrollTop = function() {
        $scope.$content.scrollTop(0);
        $scope.$scroll.scrollTop(0);
        $scope.$scroll.css({        'transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({'-webkit-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({    '-ms-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
    }
    
    $scope.timer = u.createTimer(function() {
        for(i = 0 ; i < $scope.events.length ; i++) {
            var _new = $scope.events[i];
            var remainSeconds = Math.max(Math.floor((_new.RoadShow.StartDate.getTime() - new Date().getTime()) / 1000), 0);
            var dd = Math.floor(remainSeconds / (60*60*24));
            var hh = Math.floor(remainSeconds / (60*60)) % 24;
            var mi = Math.floor(remainSeconds / (60)) % 60;
            var ss = remainSeconds % 60;
//            _new.expireRemain = sprintf("%ddays, %02dhrs, %02dmins, %02dseconds", dd, hh, mi, ss);
            _new.expireRemain = sprintf("%ddays, %02d:%02d:%02d", dd, hh, mi, ss);
//            console.log(_new);
            if(_new.RoadShow.EndDateTime && Date.now() > _new.RoadShow.EndDateTime.getTime()){
                _new.expireDesc = "Event is ended.";
            }else if(_new.RoadShow.StartDate && Date.now() > _new.RoadShow.StartDate.getTime()){
                _new.expireDesc = "Event is started!";
            }else{
                _new.expireDesc = "Event is coming!!";
            }
            _new.expireRemainFinished = !(dd || hh || mi || ss);
        }
        
        console.log("timer");
    });
    $scope.attempEvent = function(event) {
        u.openLogin().then(function() {
            if(event.RoadShow.Attend) {
                u.showAlert('You already joined this event');
                return;
            }
            u.showProgress();
            api.getAttemp(event).then(function(result) {
                if(result.Attend) {
                    u.showAlert('You already joined this event');
                    event.RoadShow.TotalAttend = result.TotalAttend;
                    event.RoadShow.Attend = result.Attend;
                    u.hideProgress();
                }else{
                    api.attemp(event).then(function(result) {
                        u.showAlert('Thank you for joining this event');
                        event.RoadShow.TotalAttend = result.TotalAttend;
                        event.RoadShow.Attend = result.Attend;
                    }).catch(function(error) {
                        u.showAlert(error.description);
                    }).finally(function(){
                        u.hideProgress();
                    });                    
                }
            });
        });
    }
    $scope.click = function(event) {
        if(event.RoadShow.WhatNewsClickMode == "ClickOpenUrl") {
            u.navigateToStateWithIntent('app.web', {url:event.RoadShow.WhatNewsClickUrl});   
        }else if(event.RoadShow.WhatNewsClickMode == "ClickShowDetail") {
            $scope.showDetail(event);
        }else{
            //no action
        }
    }
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        $scope.$element = $('#events[nav-view=active], #events[nav-view=entering]');
        $scope.$content = $scope.$element.find('ion-content .content>');
        $scope.$scroll = $scope.$element.find('ion-content>.scroll');
        $scope.$scrollDelegate = $ionicScrollDelegate.$getByHandle('scrollDelegate');
        $scope.timer.start(); 
        if(state.direction == 'none' || state.direction == 'forward') {
//            $scope.$scrollDelegate.scrollTop(false);
            $scope.scrollTop();
        }
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.events = [];
            $scope.tabIndex = 0;
            u.showProgress();
            api.getAll().then(function(results) {
                $scope.events = results;
                var groupByMonth = _.groupBy($scope.events, function(o) {
                    var ts = moment(o.RoadShow.StartDate);
                    return ts.format("MMM")+','+ts.format("YYYY");
                });
                $scope.eventTabs = [];
                for(k in groupByMonth) {
                    console.log(k, groupByMonth[k]);
                    
                    
                    var splits = k.split(",");
                    var month = splits[0];
                    var year = splits[1];
                    
                    $scope.eventTabs.push({
                        'title':month,
                        'events':groupByMonth[k]
                    });
                    
                }
                console.log('eventTabs',$scope.eventTabs);
                
                
                
                
                $scope.timer.start();
                return $timeout(function(){
                    u.imagesLoaded($scope.$content.find('img').slice(0,2));
                },200);
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
        }else{
            $scope.timer.start();
        }
    });
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        $scope.timer.stop();
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.events = [];
            $scope.contentReady = false;
//            $scope.scrollTop();
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
}
function EventDetailBaseController($scope, u, $timeout, $state, $ionicScrollDelegate, apiTicket, $sce, googleApiKey, rateTitle, api) {
    $scope.scrollTop = function() {
//        $scope.$scrollDelegate.scrollTop(false);
        $scope.$content.scrollTop(0);
        $scope.$scroll.scrollTop(0);
        $scope.$scroll.css({        'transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({'-webkit-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({    '-ms-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
    }
    $scope.rate = u.createRate();
    $scope.rate.title = rateTitle;
    $scope.attempEvent = function(event) {
        u.openLogin().then(function() {
            if(event.RoadShow.Attend) {
                u.showAlert('You already joined this event');
                return;
            }
            u.showProgress();
            api.getAttemp(event).then(function(result) {
                if(result.Attend) {
                    u.showAlert('You already joined this event');
                    event.RoadShow.TotalAttend = result.TotalAttend;
                    event.RoadShow.Attend = result.Attend;
                    u.hideProgress();
                }else{
                    api.attemp(event).then(function(result) {
                        u.showAlert('Thank you for joining this event');
                        event.RoadShow.TotalAttend = result.TotalAttend;
                        event.RoadShow.Attend = result.Attend;
                    }).catch(function(error) {
                        u.showAlert(error.description);
                    }).finally(function(){
                        u.hideProgress();
                    });                    
                }
            });
        });
    }
    $scope.showLocation = function() {
        u.navigateToStateWithIntent('app.location', {'Lat':$scope.latitude, 'Lot':$scope.longitude});   
    }
    $scope.learnmore = function() {
        $scope.learnmoretooshort=false; 
        $scope.expanded=true;
        $ionicScrollDelegate.resize();
        $timeout(function() {
            $ionicScrollDelegate.resize();
        },2000);
    }
    
    $scope.submitReview = function(event) {
        //   
    }
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        $scope.$element = $('#eventdetail[nav-view=active], #eventdetail[nav-view=entering]');
        $scope.$content = $scope.$element.find('ion-content .content>');
        $scope.$scroll = $scope.$element.find('ion-content>.scroll');
        $scope.$scrollDelegate = $ionicScrollDelegate.$getByHandle('scrollDelegate');
        $scope.$learnmore = $scope.$content.find('.learn-more-container');
        if(state.direction == 'none' || state.direction == 'forward') {
//            $scope.$scrollDelegate.scrollTop(false);
            $scope.scrollTop();
        }
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.event = null;
            u.showProgress();
            api.getById($state.params.id).then(function(results) {
                $scope.event = results;
                $timeout(function(){
                    $scope.learnmoretooshort = $scope.$learnmore.height()<160;
                });
                $timeout(function() {
                    $scope.latitude = results.RoadShow.VenueLat;
                    $scope.longitude = results.RoadShow.VenueLot;
                    $scope.apiKey = googleApiKey;
                    if($scope.latitude && $scope.longitude) {

                        $scope.mapurl = 
                            'https://www.google.com/maps/embed/v1/place'+
                            '?key='+$scope.apiKey+
                            '&q='+$scope.latitude+','+$scope.longitude+
                            '&zoom=18'
                        ;
                        $scope.mapurl = $sce.trustAsResourceUrl($scope.mapurl);

                    }else{
                        $scope.mapurl = '';   
                    }    
                },1500);
                return $timeout(function(){
                    u.imagesLoaded($scope.$content.find('img').slice(0,2));
                },200);
            }).then(function(){
                $scope.setRateFrom($scope.event);
                $scope.getRateFor($scope.event);
                
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
//            $scope.scrollTop();
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
}

function ReviewBaseController($scope, u, $timeout, $state, $ionicScrollDelegate, $ionicHistory, Popup, apiUser) {
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.feedbackFormFields = null; 
            $scope.fields = null;
            u.showProgress();
            $scope.api.getFeedbackForm().then(function(results) {
                $scope.fields = [];
                for(var k in results) {
                    var formField = results[k];
                    if(formField.Type == 0) {
                        //Text Box
                        formField.Value = "";
                    }else if(formField.Type == 2) {
                        //Radio Button
                        formField.Value = formField.Choices ? formField.Choices[0] : null;
                    }
                    $scope.fields.push(formField);
                }
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
    $scope.submit = function() {
        u.openLogin().then(function() {
            var feedbackResults = [];
            for(var k in $scope.fields) {
                var formField = $scope.fields[k];
                var field = {};
                field.FieldId = formField.Id;
                field.Type = formField.Type;
                field.Value = formField.Value;
                field[$scope.IdPropertyName] = $state.params.id;
                field.CustomerId = apiUser.getUser().CustomerId;
                feedbackResults.push(field);
            }
            u.showProgress();
            $scope.api.postFeedbackForm(feedbackResults).then(function(results) {
                Popup.alert({
                    'title': 'Thank for reviewing question!',
                    'buttons': [{
                        'text': 'Back',
                        'type': 'button-positive'
                    }]
                }).then(function(){
                    $ionicHistory.goBack(-1);
                });
            }).catch(function(error) {
                u.showAlert(error.description);
            }).finally(function() {
                u.hideProgress();
            });            
        });
    }
}


angular.module('starter.controllers', [])
.controller('AppCtrl', function ($rootScope, $scope, $ionicModal, $timeout, u, apiUser) {
});

/* ================================
   WhatsNewsController
   ================================ */
function WhatsNewsController($scope, u, $timeout, $state, $ionicScrollDelegate, apiTicket, apiWhatsNews) {
    EventsBaseController.call(this, $scope, u, $timeout, $state, $ionicScrollDelegate, apiTicket, "What's News", apiWhatsNews);
    $scope.showDetail = function(event) { $state.go("app.whatsnewsdetail", {id:event.EventId}); }
    $scope.share = function(event) { u.shareWhatsNews(event); }
}
WhatsNewsController.prototype = Object.create(EventsBaseController.prototype);
angular.module('starter.controllers').controller('WhatsNewsCtrl', WhatsNewsController)
/* ================================
   WhatsNewsDetailController
   ================================ */
function WhatsNewsDetailController($scope, u, $timeout, $state, $ionicScrollDelegate, apiTicket, $sce, googleApiKey, apiWhatsNews) {
    EventDetailBaseController.call(this, $scope, u, $timeout, $state, $ionicScrollDelegate, apiTicket, $sce, googleApiKey, "Rate this Event", apiWhatsNews);
    $scope.setRateFrom = function(event) { $scope.rate.setRateFromWhatsNews($scope.event); }
    $scope.getRateFor = function(event) { $scope.rate.getRateForWhatsNews($scope.event); }
    $scope.submitReview = function(event) { 
        u.openLogin().then(function() {
            $state.go('app.whatsnewsreview', {id:event.EventId}); 
        });
    }
}
WhatsNewsDetailController.prototype = Object.create(EventDetailBaseController.prototype);
angular.module('starter.controllers').controller('WhatsNewsDetailCtrl', WhatsNewsDetailController)
/* ================================
   WhatsNewsReviewController
   ================================ */
function WhatsNewsReviewController($scope, u, $timeout, $state, $ionicScrollDelegate, $ionicHistory, Popup, apiUser, apiWhatsNews) {
    ReviewBaseController.call(this, $scope, u, $timeout, $state, $ionicScrollDelegate, $ionicHistory, Popup, apiUser);
    $scope.api = apiWhatsNews;
    $scope.IdPropertyName = "EventId";
}
WhatsNewsReviewController.prototype = Object.create(ReviewBaseController.prototype);
angular.module('starter.controllers').controller('WhatsNewsReviewCtrl', WhatsNewsReviewController)
/* ================================
   VouchersController
   ================================ */
function VouchersController($scope, u, $timeout, $state, $ionicScrollDelegate, apiTicket, apiVoucher) {
    EventsBaseController.call(this, $scope, u, $timeout, $state, $ionicScrollDelegate, apiTicket, "Voucher", apiVoucher);
    $scope.showDetail = function(event) { $state.go("app.voucherdetail", {id:event.EventId}); }
    $scope.share = function(event) { u.shareVoucher(event); }
    $scope.submitReview = function(event) {
        u.openLogin().then(function() {
            $state.go('app.voucherreview', {id:event.EventId}); 
        });
    }
}
VouchersController.prototype = Object.create(EventsBaseController.prototype);
angular.module('starter.controllers').controller('VouchersCtrl', VouchersController)
/* ================================
   VoucherDetailController
   ================================ */
function VoucherDetailController($scope, u, $timeout, $state, $ionicScrollDelegate, apiTicket, $sce, googleApiKey, apiVoucher) {
    EventDetailBaseController.call(this, $scope, u, $timeout, $state, $ionicScrollDelegate, apiTicket, $sce, googleApiKey, "Rate this Event", apiVoucher);
    $scope.setRateFrom = function(event) { $scope.rate.setRateFromVoucher($scope.event); }
    $scope.getRateFor = function(event) { $scope.rate.getRateForVoucher($scope.event); }
}
VoucherDetailController.prototype = Object.create(EventDetailBaseController.prototype);
angular.module('starter.controllers').controller('VoucherDetailCtrl', VoucherDetailController)
/* ================================
   VoucherReviewController
   ================================ */
function VoucherReviewController($scope, u, $timeout, $state, $ionicScrollDelegate, $ionicHistory, Popup, apiUser, apiVoucher) {
    ReviewBaseController.call(this, $scope, u, $timeout, $state, $ionicScrollDelegate, $ionicHistory, Popup, apiUser);
    $scope.api = apiVoucher;
    $scope.IdPropertyName = "EventId";
}
VoucherReviewController.prototype = Object.create(ReviewBaseController.prototype);
angular.module('starter.controllers').controller('VoucherReviewCtrl', VoucherReviewController)
/* ================================
   EventsController
   ================================ */
function EventsController($scope, u, $timeout, $state, $ionicScrollDelegate, apiTicket, apiEvent) {
    EventsBaseController.call(this, $scope, u, $timeout, $state, $ionicScrollDelegate, apiTicket, "Event", apiEvent);
    $scope.showDetail = function(event) { $state.go("app.eventdetail", {id:event.EventId}); }
    $scope.share = function(event) { u.shareEvent(event); }
    $scope.submitReview = function(event) {
        u.openLogin().then(function() {
            $state.go('app.eventreview', {id:event.EventId}); 
        });
    }
}
EventsController.prototype = Object.create(EventsBaseController.prototype);
angular.module('starter.controllers').controller('EventsCtrl', EventsController);
/* ================================
   EventDetailController
   ================================ */
function EventDetailController($scope, u, $timeout, $state, $ionicScrollDelegate, apiTicket, $sce, googleApiKey, apiEvent) {
    EventDetailBaseController.call(this, $scope, u, $timeout, $state, $ionicScrollDelegate, apiTicket, $sce, googleApiKey, "Rate this Event", apiEvent);
    $scope.setRateFrom = function(event) { $scope.rate.setRateFromEvent($scope.event); }
    $scope.getRateFor = function(event) { $scope.rate.getRateForEvent($scope.event); }
}
EventDetailController.prototype = Object.create(EventDetailBaseController.prototype);
angular.module('starter.controllers').controller('EventDetailCtrl', EventDetailController);
/* ================================
   EventReviewController
   ================================ */
function EventReviewController($scope, u, $timeout, $state, $ionicScrollDelegate, $ionicHistory, Popup, apiUser, apiEvent) {
    ReviewBaseController.call(this, $scope, u, $timeout, $state, $ionicScrollDelegate, $ionicHistory, Popup, apiUser);
    $scope.api = apiEvent;
    $scope.IdPropertyName = "EventId";
}
EventReviewController.prototype = Object.create(ReviewBaseController.prototype);
angular.module('starter.controllers').controller('EventReviewCtrl', EventReviewController)


angular.module('starter.controllers')
.controller('PurchasedPropertiesCtrl', function ($scope, u, $timeout, $q, $state, $ionicScrollDelegate, apiPurchasedProperty,apiUser) {
    $scope.scrollTop = function() {
        $scope.$content.scrollTop(0);
        $scope.$scroll.scrollTop(0);
        $scope.$scroll.css({        'transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({'-webkit-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({    '-ms-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
    }
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        $scope.$element = $('#purchasedproperties[nav-view=active], #purchasedproperties[nav-view=entering]');
        $scope.$content = $scope.$element.find('ion-content .content>');
        $scope.$scroll = $scope.$element.find('ion-content>.scroll');
        if(state.direction == 'none' || state.direction == 'forward') {
            $scope.scrollTop();
        }
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
            $scope.units = [];
            $scope.scrollTop();
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('PurchasedPropertyDetailCtrl', function ($scope, u, $timeout, $state, $ionicScrollDelegate, apiPurchasedProperty, apiConsultant) {
    $scope.scrollTop = function() {
        $scope.$content.scrollTop(0);
        $scope.$scroll.scrollTop(0);
        $scope.$scroll.css({        'transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({'-webkit-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({    '-ms-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
    }
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        $scope.$element = $('#purchasedpropertydetail[nav-view=active], #purchasedpropertydetail[nav-view=entering]');
        $scope.$content = $scope.$element.find('ion-content .content>');
        $scope.$scroll = $scope.$element.find('ion-content>.scroll');
        if(state.direction == 'none' || state.direction == 'forward') {
            $scope.scrollTop();
        }
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
                    u.imagesLoaded($scope.$content.find('img').slice(0,2));
                },200);
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
            $scope.unit = null;
            $scope.agent = null;
            $scope.scrollTop();
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('UnitFloorplanCtrl', function ($scope, u, $q, $timeout, $state, apiProjectUnitType, apiProjectUnitFloor) {
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        $scope.$element = $('#floorplan[nav-view=active], #floorplan[nav-view=entering]');
        $scope.$content = $element.find('ion-content .content');
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})



.controller('TicketsCtrl', function ($scope, u, $timeout, $state, $ionicScrollDelegate, apiTicket) {
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
            $scope.tickets = [];
//            $ionicScrollDelegate.scrollTop(false);
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('TicketCtrl', function ($scope, u, $state, apiTicket) {
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('ConstructionsCtrl', function ($scope, u, $timeout, $state,  $ionicScrollDelegate, apiProject) {
    $scope.scrollTop = function() {
        $scope.$content.scrollTop(0);
        $scope.$scroll.scrollTop(0);
        $scope.$scroll.css({        'transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({'-webkit-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({    '-ms-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
    }
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        $scope.$element = $("#Constructions[nav-view=active], #Constructions[nav-view=entering]");
        $scope.$content = $scope.$element.find('ion-content .content>');
        $scope.$scroll = $scope.$element.find('ion-content>.scroll');
        if(state.direction == 'none' || state.direction == 'forward') {
            $scope.scrollTop();
        }
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.constructions = [];
            $scope.tabIndex = 'COMMERCIAL';
            u.showProgress();
            apiProject.getAll().then(function(results) {
                $scope.projects = _.filter(results, function(o) {
                    return o.Contructions && o.Contructions.length;
                })
                return $timeout(function(){
                    u.imagesLoaded($scope.$content.find('img').slice(0,2));
                },200);
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
            $scope.proejcts = [];
            $scope.scrollTop();
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('ConstructionDetailCtrl', function ($scope, u, $timeout, $state, $ionicScrollDelegate, apiProject) {
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        $scope.$element = $('#constructiondetail[nav-view=active], #constructiondetail[nav-view=entering]');
        $scope.$content = $scope.$element.find('ion-content .content');
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.project = null;
            u.showProgress();
            apiProject.useCache().getById($state.params.id).then(function(results) {
                $scope.project = results;
                return $timeout(function(){
                    u.imagesLoaded($scope.$content.find('img').slice(0,2));
                },200);
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
            $scope.project = null;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})


.controller('PropertiesCtrl', function ($scope, u, $timeout, $state, apiProperty, $ionicScrollDelegate) {
    $scope.scrollTop = function() {
        console.log('$scope.$scroll.length = '+$scope.$scroll.length);
        console.log($scope.$scroll);
//        $scope.$scrollDelegate.scrollTop(false);
        $scope.$content.scrollTop(0);
        $scope.$scroll.scrollTop(0);
        $scope.$scroll.css({        'transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({'-webkit-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({    '-ms-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
    }
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        $scope.$element = $("#properties[nav-view=active], #properties[nav-view=entering]");
        $scope.$content = $scope.$element.find('ion-content .content>');
        $scope.$scroll = $scope.$element.find('ion-content>.scroll');
        $scope.$scrollDelegate = $ionicScrollDelegate.$getByHandle('scrollDelegate');
        console.log('PropertiesCtrl.afterEnter @ ' + state.direction);
        if(state.direction == 'none' || state.direction == 'forward') {
            $scope.scrollTop();
        }
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.properties = [];
            $scope.tabIndex = 'COMMERCIAL';
            u.showProgress();
            apiProperty.getAll().then(function(results) {
                $scope.properties = results;
                return $timeout(function(){
                    u.imagesLoaded($scope.$content.find('img').slice(0,2));
                },200);
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        console.log('PropertiesCtrl.afterLeave @'+state.direction);
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
            $scope.properties = [];
//            $scope.scrollTop();
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('PropertyDetailCtrl', function ($scope, u, $timeout, $state,  $ionicScrollDelegate, $rootScope, apiProperty,apiUser) {
    $scope.scrollTop = function() {
        //$scope.$scrollDelegate.scrollTop(false);
        $scope.$content.scrollTop(0);
        $scope.$scroll.scrollTop(0);
        $scope.$scroll.css({        'transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({'-webkit-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({    '-ms-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
    }
    
    $scope.rate = u.createRate();
    $scope.rate.title = 'Rate this Property';
    
    $scope.learnmore = function() {
        $scope.learnmoretooshort=false; 
        $scope.expanded=true;
        $ionicScrollDelegate.resize()   
        $timeout(function() {
            $ionicScrollDelegate.resize();
        },2000);
    }
    
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        $scope.$element = $("#propertydetail[nav-view=active], #propertydetail[nav-view=entering]");
        $scope.$content = $scope.$element.find('ion-content .content>');
        $scope.$scroll = $scope.$element.find('ion-content>.scroll');
        $scope.$scrollDelegate = $ionicScrollDelegate.$getByHandle('scrollDelegate');
        $scope.$learnmore = $scope.$content.find('.learn-more-container');
        console.log('PropertyDetailCtrl.afterEnter @ ' + state.direction);
        if(state.direction == 'none' || state.direction == 'forward') {
            $scope.scrollTop();
        }
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
                    $scope.learnmoretooshort = $scope.$learnmore.height()<160;
                });
                return $timeout(function(){
                    u.imagesLoaded($scope.$element.find('img'));
                },200);
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        console.log('PropertyDetail.afterLeave @'+state.direction);
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
            $scope.property = null;
            $scope.project = null;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
});

/* ================================
   PropertyReviewController
   ================================ */
function PropertyReviewController($scope, u, $timeout, $state, $ionicScrollDelegate, $ionicHistory, Popup, apiUser, apiProperty) {
    ReviewBaseController.call(this, $scope, u, $timeout, $state, $ionicScrollDelegate, $ionicHistory, Popup, apiUser);
    $scope.api = apiProperty;
    $scope.IdPropertyName = "ProjectId";
}
EventReviewController.prototype = Object.create(ReviewBaseController.prototype);
angular.module('starter.controllers').controller('PropertyReviewCtrl', PropertyReviewController)


angular.module('starter.controllers').controller('PropertySpecificationCtrl', function ($scope, u, $timeout, $state, apiProperty, $sce) {
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('PropertyLocationCtrl', function ($scope, u, $timeout, $state, apiProperty, $sce) {
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
            $scope.url = '';
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('PropertyGalleryCtrl', function ($scope, u, $timeout, $state, apiProperty) {
    $scope.scrollTop = function() {
        $scope.$content.scrollTop(0);
        $scope.$scroll.scrollTop(0);
        $scope.$scroll.css({        'transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({'-webkit-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({    '-ms-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
    }
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        $scope.$element = $("#gallery[nav-view=active], #gallery[nav-view=entering]");
        $scope.$content = $scope.$element.find('ion-content .content');
        $scope.$scroll = $scope.$element.find('ion-content>.scroll');
        if(state.direction == 'none' || state.direction == 'forward') {
            $scope.scrollTop();
        }
        if(state.direction != 'back') {
            $scope.property = null; 
            u.showProgress();
            apiProperty.useCache().getById($state.params.id).then(function(results) {
                $scope.photos = results.ProjectPhotos;
                return $timeout(function(){
                    u.imagesLoaded($scope.$content.find('img').slice(0,2));
                },200);
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.photos = [];
            $scope.contentReady = false;
//            $scope.scrollTop();
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('PropertyFloorplanCtrl', function ($scope, u, $timeout, $state, apiProjectUnitFloor, apiService) {
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})
.controller('ConsultantsCtrl', function ($scope, u, $timeout, $state, apiProperty) {
    $scope.scrollTop = function() {
        $scope.$content.scrollTop(0);
        $scope.$scroll.scrollTop(0);
        $scope.$scroll.css({        'transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({'-webkit-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({    '-ms-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
    }
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        $scope.$element = $('#consultants[nav-view=active], #consultants[nav-view=entering]');
        $scope.$content = $scope.$element.find('ion-content .content');
        $scope.$scroll = $scope.$element.find('ion-content>.scroll'); 
        if(state.direction == 'none' || state.direction == 'forward') {
            $scope.scrollTop();
        }
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
            $scope.properties = [];
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('ConsultantsWhereProjectCtrl', function ($scope, u, $timeout, $state,  $ionicScrollDelegate, $q, apiConsultant, apiProject) {
    $scope.scrollTop = function() {
//        $ionicScrollDelegate.scrollTop(false);
        $scope.$content.scrollTop(0);
        $scope.$scroll.scrollTop(0);
        $scope.$scroll.css({        'transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({'-webkit-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({    '-ms-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
    }
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        $scope.$element = $('#consultantswhereproject[nav-view=active], #consultantswhereproject[nav-view=entering]');
        $scope.$content = $scope.$element.find('ion-content .content');
        $scope.$scroll = $scope.$element.find('ion-content>.scroll'); 
        if(state.direction == 'none' || state.direction == 'forward') {
            $scope.scrollTop();
        }
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.consultants = [];
            $scope.project = null;
            u.showProgress();
            $q.all([apiConsultant.getByProjectId($state.params.projectId), 
                    apiProject.useCache().getById($state.params.projectId)]).then(function(results) {
                $scope.consultants = results[0];
                $scope.consultants = _.sortBy($scope.consultants, 'FullName');
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
            $scope.project = null;
            $scope.consultants = [];
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('ConsultantDetailCtrl', function ($scope, u, $state, $timeout, $ionicScrollDelegate, apiConsultant) {
    $scope.scrollTop = function() {
        $scope.$content.scrollTop(0);
        $scope.$scroll.scrollTop(0);
        $scope.$scroll.css({        'transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({'-webkit-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
        $scope.$scroll.css({    '-ms-transform': 'translate3d(0px, 0px, 0px) scale(1)'});
    }
    $scope.rate = u.createRate();
    $scope.rate.title = 'Rate this Consultant';
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        $scope.$element = $('#consultantdetail[nav-view=active], #consultantdetail[nav-view=entering]');
        $scope.$scroll = $scope.$element.find('ion-content>.scroll'); 
        $scope.$content = $scope.$element.find('ion-content .content');
        if(state.direction == 'none' || state.direction == 'forward') {
            $scope.scrollTop();
        }
        if(state.direction != 'back') {
            $scope.contentReady = false;
            $scope.contentAnimated = false;
            $scope.consultant = null;
            u.showProgress();
            apiConsultant.getById($state.params.id).then(function(results) {
                $scope.consultant = results;
                return $timeout(function(){
                    u.imagesLoaded($scope.$content.find('img').slice(0,2));
                },200);
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
});


/* ================================
   ConsultantReviewController
   ================================ */
function ConsultantReviewController($scope, u, $timeout, $state, $ionicScrollDelegate, $ionicHistory, Popup, apiUser, apiConsultant) {
    ReviewBaseController.call(this, $scope, u, $timeout, $state, $ionicScrollDelegate, $ionicHistory, Popup, apiUser);
    $scope.api = apiConsultant;
    $scope.IdPropertyName = "SysUserId";
}
ConsultantReviewController.prototype = Object.create(ReviewBaseController.prototype);
angular.module('starter.controllers').controller('ConsultantReviewCtrl', ConsultantReviewController)

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
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = true;
            $scope.contentAnimated = true;
        }
    });
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('AboutDetailCtrl', function($scope, u, $timeout) {
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.contentReady = true;
            $scope.contentAnimated = true;
        }
    });
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('AboutUsCtrl', function ($scope, u, $timeout, $ionicConfig, $cordovaInAppBrowser, app) {
    $scope.openFacebook = function () {
        window.open('https://www.facebook.com/hattengroup/', '_system','location=yes');        
    }
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        console.log(app);
        if (state.direction != 'back') {
            $scope.contentReady = true;
            $scope.contentAnimated = true;
        }
    });
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if (state.direction == 'none' || state.direction == 'back') {
            $scope.contentReady = false;
        }
        if (state.direction == 'forward') {
            $scope.contentAnimated = false;
        }
    });
})

.controller('AboutHattenGroupCtrl', function ($scope, u, $timeout, $cordovaInAppBrowser) {
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        if (state.direction != 'back') {
            $scope.contentReady = true;
            $scope.contentAnimated = true;
        }
    });
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if (state.direction == 'none' || state.direction == 'back') {
            $scope.contentReady = false;
        }
        if (state.direction == 'forward') {
            $scope.contentAnimated = false;
        }
    });
})

.controller('ContactUsCtrl', function ($scope, u, $timeout, $sce) {
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        if (state.direction != 'back') {
            $scope.contentReady = true;
            $scope.contentAnimated = true;
        }
    });
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if (state.direction == 'none' || state.direction == 'back') {
            $scope.contentReady = false;
        }
        if (state.direction == 'forward') {
            $scope.contentAnimated = false;
        }
    });
})

.controller('ProfileCtrl', function ($scope, u, $timeout, Popup, apiUser, apiTitle, apiCountry) {
    var vm = $scope;
    $scope.save = function () {
        u.showProgress();
        apiUser.edit(vm.user).then(function (result) {
            u.showAlert('User profile is updated');
        }).finally(function () {
            u.hideProgress();
        });
    }
    $scope.showChangePassword = function () {
        $scope.changePasswordUser = {};
        $scope.changePasswordUser.iCustomerId = apiUser.getUser().CustomerId;
        $scope.changePasswordUser.email = apiUser.getUser().Email;
        $scope.changePasswordUser.pass = '';
        var myPopup = Popup.show({
            template: '<input type="password" ng-model="changePasswordUser.pass">',
            title: 'Enter New Password',
            scope: $scope,
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.changePasswordUser.pass) {
                            myPopup.close();
                            //u.showAlert("Please fill in the password");
                        } else {
                            u.showProgress();
                            apiUser.changePassword(changePasswordUser).done(function(result){
                                u.showAlert("Your password is updated"); 
                            }).catch(function(error){
                                u.showAlert(error.description);
                            }).finally(function() {
                                u.hideProgress();
//                                myPopup.close();
                            });
                        }
                    }
                }
            ]
        });
    }
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        if (state.direction != 'back') {
            $scope.contentReady = true;
            $scope.contentAnimated = true;

            apiTitle.getAll().then(function (results) {
                vm.titleOptions = results;
            });
            apiCountry.getAll().then(function (results) {
                vm.callingCodeOptions = results;
            });
            vm.user = {};
            vm.user.IC = apiUser.getUser().IC;
            vm.user.Title = apiUser.getUser().Title;
            vm.user.EmailAddress = apiUser.getUser().Email;
            vm.user.CallingCode = parseInt(apiUser.getUser().Contact.CallingCode);
            vm.user.ContactNumber = apiUser.getUser().Contact.ContactNumber;
            vm.user.FullName = apiUser.getUser().FullName;
            vm.user.sPass = apiUser.getUser().Pass;

            console.log(vm.user);
        }
    });
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if (state.direction == 'none' || state.direction == 'back') {
            $scope.contentReady = false;
        }
        if (state.direction == 'forward') {
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
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
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('WebCtrl', function($scope, u, $timeout, intent, $ionicScrollDelegate, $sce) {
    $scope.iframeOnLoad = function() {
        console.log('iframeOnLoad');
        u.hideProgress();
        $timeout(function() {
            $scope.contentReady = true;
            $scope.contentAnimated = true;
        },200);
        $timeout.cancel($scope.iframeLoadExpire);
    }
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        
        $scope.$element = $('#web[nav-view=active], #web[nav-view=entering]');
        $scope.$content = $scope.$element.find('ion-content .content>');
        $scope.$scroll = $scope.$element.find('ion-content>.scroll');
        if(state.direction != 'back') {
            if(intent.item) {
                
                $scope.item = intent.item;
                $scope.title = intent.item.title || '';
                $scope.url = intent.item.url ? $sce.trustAsResourceUrl(intent.item.url) : ''; 
                u.showProgress();
                $scope.iframeLoadExpire = $timeout(function() {
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                    $scope.url = '';
                    u.hideProgress();
                },10000);
            }else{
                $scope.contentReady = true;
                $scope.contentAnimated = true;
                $scope.item = null;
                $scope.title = null;
                $scope.url = '';
            }
            $timeout(function(){
                $ionicScrollDelegate.resize();
            },200);
        }
    });
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
            $scope.url = '';
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})

.controller('LocationCtrl', function($scope, u, $timeout, intent, $ionicScrollDelegate, $sce) {
    $scope.iframeOnLoad = function() {
        console.log('iframeOnLoad');
        u.hideProgress();
        $timeout(function() {
            $scope.contentReady = true;
            $scope.contentAnimated = true;
        },200);
        $timeout.cancel($scope.iframeLoadExpire);
    }
    $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
        $scope.$element = $('#location[nav-view=active], #location[nav-view=entering]');
        $scope.$content = $scope.$element.find('ion-content .content>');
        $scope.$scroll = $scope.$element.find('ion-content>.scroll');
        
        if(state.direction != 'back') {
            $scope.contentReady = true;
            $scope.contentAnimated = true;
            $scope.latitude = intent.item.Lat;
            $scope.longitude = intent.item.Lot;
            $scope.apiKey = 'AIzaSyAZU6hYAxURw1ewJYV4OMLitTYd01xPb0I';
            if($scope.latitude && $scope.longitude) {

                $scope.url = 
                    'https://www.google.com/maps/embed/v1/place'+
                    '?key='+$scope.apiKey+
                    '&q='+$scope.latitude+','+$scope.longitude+
                    '&zoom=18'
                ;
                $scope.url = $sce.trustAsResourceUrl($scope.url);
                
                u.showProgress();
                $scope.iframeLoadExpire = $timeout(function() {
                    $scope.contentReady = true;
                    $scope.contentAnimated = true;
                    $scope.url = '';
                    u.hideProgress();
                },10000);
            }else{
                $scope.url = '';   
            }
            $timeout(function(){
                $ionicScrollDelegate.resize();
            },200);
        }
    });
    $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
        if(state.direction == 'none' || state.direction == 'back'){
            $scope.contentReady = false;
        }
        if(state.direction == 'forward'){
            $scope.contentAnimated = false;
        }
    });
})




;