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
          $ionicPopup, 
          $ionicLoading, 
          $cordovaSocialSharing, 
          $cordovaAppRate, 
          $cordovaProgress,
          $cordovaAppVersion,
          app) {
    var _this = this;
    
/* ==========================================================================
   Login
   ========================================================================== */
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $rootScope
    }).then(function (modal) {
        $rootScope.loginModal = modal;
    });
    this.closeLogin = function () {
        $rootScope.loginModal.hide();
    };
    this.openLogin = function () {
        $rootScope.loginAlert = null;
        $rootScope.loginData = {};
        $rootScope.loginData.username = 'TAREN.SUNIL@YAHOO.COM';
        $rootScope.loginData.password = 'wendyjsy';
        $ret = $rootScope.loginModal.show();
        return $q(function(resolve, reject) {
            $ret = $rootScope.$on('modal.hidden', function() {
                $ret();
                resolve();
            });
        });
    }
    this.doLogout = function() {
        apiUser.logout();
    }
    this.doLogin = function () {
        _this.showProgress();
        apiUser.login($rootScope.loginData.username, $rootScope.loginData.password).then(function(results){
            _this.closeLogin();
        }).catch(function(error) {
            $rootScope.loginAlert = {
                message: error.description 
            }
        }).finally(function(){
            _this.hideProgress();
        });
    };
/* ==========================================================================
   Show Progress, Error
   ========================================================================== */
    this.showProgress = function() {
        $ionicLoading.show({
            delay: 300,
            templateUrl: 'templates/loading.html'
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
    this.createRate = function(o){
        var ret = {
            title:'Rate this Property',
            setRate:function(i) {
                var oldval = Math.floor(this.rate);
                if(oldval == i && oldval > 1) {
                    this.rate = oldval - 1;
                }else{
                    this.rate = i;
                }
                var newval = this.rate;
                if(oldval != newval) {
                    if(this.onSetRate)   
                        this.onSetRate(newval)
                }
            },
            rate:o.RateValue || 3,
            review: {
                averageRate:o.AverRate || 0,
                totalPeople:o.Total || 0,
                totalRatePerStars:[
                    o.Total1 || o.Star1 || 0, 
                    o.Total2 || o.Star2 || 0,
                    o.Total3 || o.Star3 || 0,
                    o.Total4 || o.Star4 || 0,
                    o.Total5 || o.Star5 || 0
                ],
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