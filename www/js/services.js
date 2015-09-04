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


.service('u', function ($state, $location, intent, $q, $rootScope, $ionicModal, apiUser, $ionicPopup, $ionicLoading, $cordovaSocialSharing, $cordovaAppRate, $cordovaProgress) {
    var _this = this;
    
   //Start Login
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
                message: error.error_message   
            }
        }).finally(function(){
            _this.hideProgress();
        });
    };
    //End Login
    
    this.toggleFavourited = function (item) {
        item.favourited = !item.favourited;
    }
    
    this.showProgress = function() {
//        if(window.cordova === undefined) return;
//        
//        $cordovaProgress.showSimple();
        $ionicLoading.show({
            delay: 300,
            templateUrl: 'templates/loading.html'
        });
    }
    this.hideProgress = function() {
//        if(window.cordova === undefined) return;
//        
//        $cordovaProgress.hide();
        
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

    this.share = function (item) {
        if(window.cordova === undefined) return;
        
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

        $cordovaSocialSharing
            .share(message, subject, file, link) // Share via native share sheet
            .then(function (result) {
                // Success!
            }, function (err) {
                // An error occured. Show a message to the user
            });
    }
    
    this.rateApp = function() {
        if(window.cordova === undefined) return;
        
        $cordovaAppRate.promptForRating(true).then(function (result) {
            // success
        });
    }
    
    this.waitDeviceReadyAndViewDidLoaded = function($scope) {
        var defer = $q(function(resolve, reject) {
            var i = 0;
            ionic.Platform.ready(function(){
                console.log('ready');
                if(++i==2) {
                    resolve();   
                }
            });
            $scope.$on('$ionicView.loaded', function (viewInfo, state) {
                console.log('$ionicView.loaded');
                if(++i==2) {
                    resolve();   
                }
            });        
        });
        return defer;
    }
    
    
    this.navigateToStateWithIntent = function(state, item) {
        intent.item = item;
//        $location.path(url);   
        $state.go(state);
    }
});