angular.module('services', ['ngResource'])

.config(function ($cordovaAppRateProvider) {

    document.addEventListener("deviceready", function () {

        var prefs = {
            language: 'en',
            appName: 'Purchaser',
            iosURL: 'https://itunes.apple.com/us/app/keynote/id361285480?mt=8',
            androidURL: 'market://details?id=com.hatten.purchaser'
        };

        $cordovaAppRateProvider.setPreferences(prefs)

    }, false);
})


.value('intent', {})
.service('u', function (
         $timeout, 
          $interval, 
          $state, 
          $location, 
          intent, 
          $q, 
          $rootScope, 
          $ionicModal, 
          apiUser, 
          apiProperty,
          apiConsultant,
          apiEvent,
          $ionicPopup, 
          $ionicLoading, 
          $cordovaSocialSharing, 
          $cordovaAppRate, 
          $cordovaProgress,
          $cordovaAppVersion,
          $ionicSideMenuDelegate,
          $ionicViewService,
          $ionicHistory,
          app) {
    var _this = this;
    
/* ==========================================================================
   Login
   ========================================================================== */
    this.loadLogin = $ionicModal.fromTemplateUrl('templates/common/login.html', {
        scope: $rootScope
    }).then(function (modal) {
        $rootScope.loginModal = modal;
    });
    this.closeLogin = function () {
        $rootScope.loginModal.hide();
    };
    this.openLogin = function () {
        return this.loadLogin.then(function() {
            $rootScope.loginAlert = null;
            $rootScope.loginData = {};
            $rootScope.loginData.username = 'TAREN.SUNIL@YAHOO.COM';
            $rootScope.loginData.password = 'wendyjsy';
            $ret = $rootScope.loginModal.show();
            return $q(function(resolve, reject) {
                $ret = $rootScope.$on('modal.hidden', function() {
                    $ret();
                    if(apiUser.getUser()){
                        resolve(apiUser.getUser());
                    }else{
                        reject(createError('Not login'));   
                    }
                });
            });
        });
    }
    this.doLogout = function() {
        apiUser.logout();
        var currentstate = _.find($state.get(), function(o) { return o.name == $state.current.name; });
        if(currentstate) {
            if(currentstate.resolve && currentstate.resolve.login) {
                $ionicHistory.nextViewOptions({
                   disableBack: true
                });
                $ionicSideMenuDelegate.toggleLeft(false);
                $state.go("app.whatsnew");
            }
        }
    }
    this.doLogin = function () {
        _this.showProgress();
        return apiUser.login($rootScope.loginData.username, $rootScope.loginData.password).then(function(results){
            _this.closeLogin();
        }).catch(function(error) {
            $rootScope.loginAlert = {
                message: error.description 
            }
            throw error;
        }).finally(function(){
            _this.hideProgress();
        });
    };
    
    this.sideMenuLogin = function() {
        console.log('sideMenuLogin');
        if(!apiUser.getUser()){
            return _this.openLogin().then(function(){
                $ionicHistory.nextViewOptions({
                   disableBack: true
                });
                $ionicSideMenuDelegate.toggleLeft(false);
            }).catch(function(error){
                throw error;
            });
        }else{
            return $q(function(resolve,reject){
                $ionicHistory.nextViewOptions({
                   disableBack: true
                });
                $ionicSideMenuDelegate.toggleLeft(false);
                resolve(); 
            });
        }
    }
    
    this.sideMenuLoginOrNormalLogin = function() {
        console.log('sideMenuLoginOrNormalLogin');
        if($ionicSideMenuDelegate.isOpenLeft()) {
            return _this.sideMenuLogin();   
        }else{
            if(!apiUser.getUser()){
                return _this.openLogin();
            }else{
                return $q(function(resolve,reject) { resolve(apiUser.getUser()); });
            }
        }
    }
    
    this.closeSideMenuIfLogon = function() {
        console.log('closeSideMenuIfLogon');
        if(apiUser.getUser()){
            $ionicSideMenuDelegate.toggleLeft(false) 
        }
    }
    
/* ==========================================================================
   Show Progress, Error
   ========================================================================== */
    this.showProgress = function() {
        $ionicLoading.show({
            delay: 300,
            templateUrl: 'templates/common/loading.html'
        });
    }
    this.hideProgress = function() {
        $ionicLoading.hide();
    }
    
    this.showError = function(error) {
           
    }
    
    this.showAlert = function(title, msg, buttonType) {
        if(buttonType === undefined || buttonType === null) buttonType = 'button-positive';
        var alertPopup = $ionicPopup.alert({
            'title': title,
            'template': msg,
            'buttons': [{
                'text': 'Close',
                'type': buttonType
            }]
        });
        return alertPopup;
    }

/* ==========================================================================
   Favourite
   ========================================================================== */
    this.toggleFavourited = function (item) {
        item.favourited = !item.favourited;
    }
/* ==========================================================================
   Share
   ========================================================================== */
    
    this.share = function (item) {
        if(window.cordova === undefined){ var defer = $q.defer(); $q.resolve(); return defer.promise; }
        
        var message = undefined;
        if (item.message) message = item.message;
        else if (item.msg) message = item.msg;
        else if (item.description) message = item.description;
        else if (item.desc) message = item.desc;

        var subject = undefined;
        if (item.subject) subject = item.subject;
        else if (item.title) subject = item.title;
        else if (item.displayName) subject = item.displayName;
        else if (item.name) subject = item.name;

        var file = undefined;
        if (item.image) file = item.image;
        else if (item.thumb) file = item.thumb;
        else if (item.thumbnail) file = item.thumbnail;
        else if (item.avatar) file = item.avatar;

        var link = undefined;

        return $cordovaSocialSharing
            .share(message, subject, file, link) // Share via native share sheet
            .then(function (result) {
                // Success!
            }, function (err) {
                // An error occured. Show a message to the user
            });
    }
/* ==========================================================================
   Rate App
   ========================================================================== */
    this.rateApp = function() {
        if(window.cordova === undefined){ var defer = $q.defer(); $q.resolve(); return defer.promise; }
        return $cordovaAppRate.promptForRating(true).then(function (result) {
            // success
        });
    }
/* ==========================================================================
   Application Specified Rating
   ========================================================================== */
    this.createRate = function(o, title){
        var ret = {
            'apiUser':apiUser,
            'title':title,
            setRate:function(i) {
                var _self = this;
                var oldval = Math.floor(this.rate);
                var newval;
                if(oldval == i && oldval > 1) {
                    newval = oldval - 1;
                }else{
                    newval = i;
                }
                if(oldval == newval)return;
                if(apiUser.getUser()){
                    _self.rate = newval;
                    if(_self.rateFor)   
                        _self.rateFor(newval)
                }else{
                    _this.openLogin().then(function(){
                        if(apiUser.getUser()){
                            _self.rate = newval;
                            if(_self.rateFor)   
                                _self.rateFor(newval)
                        }
                    });
                }
            },
            rate:-1,
            review: {
                averageRate:0,
                totalPeople:0,
                totalRatePerStars:[0,0,0,0,0], 
                getTotalRateStars:function() { return _.max(this.totalRatePerStars); },
                getChartWidth:function(i) {
                    if(this.getTotalRateStars() == 0) {
                        return '0%';
                    }else{
                        return (this.totalRatePerStars[i] / this.getTotalRateStars()) * 100 + '%'; 
                    }
                }
            }
        };
        ret.review.totalPeople = _.reduce(ret.review.totalRatePerStars, function(s,o){
            return s+o;
        });
        ret.setRateFrom = function(o) {
            this.rate = o.RateValue || -1;
            this.review.averageRate = o.AverRate || 0;
            this.review.totalPeople = o.Total || 0;
            console.log(o);
            this.review.totalRatePerStars[4] = o.Total1 || o.Star1 || 0;
            this.review.totalRatePerStars[3] = o.Total2 || o.Star2 || 0;
            this.review.totalRatePerStars[2] = o.Total3 || o.Star3 || 0;
            this.review.totalRatePerStars[1] = o.Total4 || o.Star4 || 0;
            this.review.totalRatePerStars[0] = o.Total5 || o.Star5 || 0;
        }
        ret.rateFor = function(star) {
            if(ret.project) {
                return ret.rateForProject(ret.project,star);
            }else if(ret.consultant) {
                return ret.rateForConsultant(ret.consultant,star);
            }else{
                return $q(function(resolve,reject){
                    reject('Invalid rateFor object');
                });
            }
        }
        //Rate for Project
        ret.rateForProject = function(project, star) {
            if(ret.apiUser.getUser() == null) {
                return $q(function(resolve,reject){
                    reject(createError('Not logon'));
                });
            }
            return apiProperty.rate(project, ret.apiUser.getUser(), star).then(function(results){
                $timeout(function(){
                    ret.setRateFrom(results);  
                });
            }).catch(function(error){
                _this.showAlert(error.description);
                throw error;
            }); 
        }
        ret.setRateFromProject = function(o) {
            ret.project = o;
            return ret.setRateFrom(o);   
        }
        ret.getRateForProject = function(project) {
                if(ret.apiUser.getUser() == null) {
                    return $q(function(resolve,reject){
                        reject(createError('Not logon'));
                    });
                }
                return apiProperty.getRate(project, ret.apiUser.getUser()).then(function(results){
                ret.setRateFrom(results);  
            }).catch(function(error){
                _this.showAlert(error.description);
                throw error;
            });
        }
        //Rate for Consultant
        ret.rateForConsultant = function(consultant, star) {
            if(ret.apiUser.getUser() == null) {
                return $q(function(resolve,reject){
                    reject(createError('Not logon'));
                });
            }
            return apiConsultant.rate(consultant, ret.apiUser.getUser(), star).then(function(results){
                $timeout(function(){
                    ret.setRateFrom(results);  
                });
            }).catch(function(error){
                _this.showAlert(error.description);
                throw error;
            }); 
        }
        ret.setRateFromConsultant = function(o) {
            ret.consultant = o;
            return ret.setRateFrom(o);   
        }
        ret.getRateForConsultant = function(consultant) {
            if(ret.apiUser.getUser() == null) {
                return $q(function(resolve,reject){
                    reject(createError('Not logon'));
                });
            }
            return apiConsultant.getRate(consultant, ret.apiUser.getUser()).then(function(results){
                ret.setRateFrom(results);  
            }).catch(function(error){
                _this.showAlert(error.description);
                throw error;
            });
        }
        return ret;
    }
/* ==========================================================================
   Timer
   ========================================================================== */
    this.createTimer = function(f) {
        var ret = {};
        ret.updateExpireRemain = f;
        ret.updateExpireRemainInterval = null;
        ret.start = function() {
            if(ret.updateExpireRemainInterval) return;
            ret.updateExpireRemainInterval = $interval(function() {
                if(ret.updateExpireRemain)
                    ret.updateExpireRemain();
            },500);
        }
        ret.stop = function() {
            if(!ret.updateExpireRemainInterval) return;
            $interval.cancel(ret.updateExpireRemainInterval);
        }
        return ret;
    }
    
/* ==========================================================================
   Set Intent and Go to state
   ========================================================================== */
    this.navigateToStateWithIntent = function(state, item) {
        intent.item = item;
        $state.go(state);
    }
    
    this.disableBack = function() {
        $ionicHistory.nextViewOptions({
           disableBack: true
        });
    }
    
/* ==========================================================================
   Promise for loading images
   ========================================================================== */
    
    this.imagesLoaded = function($imgs) {
        return $q(function(resolve, reject) {
            $timeout(function() {
                var loadcnt = 0;
                $imgs.one('load', function() {
                    loadcnt++;
                    if(loadcnt == $imgs.length){
                        resolve();
                    }
                }).each(function(){
                    if(this.complete) $(this).load();
                });
            });
        });
    };
});