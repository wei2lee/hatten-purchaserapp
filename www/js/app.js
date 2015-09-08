// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
    'ionic',
    'ngAnimate',
    'ionic.rating',
    'services-api',
    'ngCordova',
    'adaptive.googlemaps',
    'route',
    'starter.controllers',
    'services',
    'angular.filter',
    'directive'
    //'monospaced.qrcode'

])

.value('app', {})
.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        console.log('app.js device ready');
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
    
    document.addEventListener("deviceready", function () {

        $cordovaAppVersion.getVersionNumber().then(function (version) {
            app.versionNumber = version;
        });

        $cordovaAppVersion.getVersionCode().then(function (build) {
            app.versionCode = build;
        });
    }, false);
});