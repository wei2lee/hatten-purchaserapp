
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
    'ionic',
    'ngAnimate',
    'services-api',
    'ngCordova',
    'route',
    'starter.controllers',
    'services',
    'angular.filter',
    'directive',
    'angular-bind-html-compile',
    'ngOnload',
    'ngIOS9UIWebViewPatch',
    'Popup'
//    'inappbrowser'
    //'monospaced.qrcode'
])
.filter('process_link', [function($sce){
    return function(text) {
        if(text) {
            $pts = $(text);
            $pt = $("<div/>");
            $pt.append($pts);
            $a = $pt.find('a');
            $a.each(function() {
                var href = $(this).attr("href");
                var ngclick = "u.navigateToStateWithIntent('app.web', {title:'"+""+"', url:'"+href+"'})";
                $(this).attr("ng-click", ngclick);
                $(this).attr("href", "javascript:void(0)");
            });
            text = $pt.get(0).outerHTML;
            return text;
        }else{
            return '';   
        }
    };
}])
.value('app', {
    firstlaunch:true,
    ionicPlatformReady:false,
    resume:false,
    deviceready:false,
    versionNumber:"0.0.0",
    versionCode:0,
    version:new SemanticVersion("0.0.0"),
    notificationPermissionGranted:false
})
.run(function ($ionicPlatform,app, u, $timeout, $cordovaAppVersion, app,$cordovaLocalNotification) {
    $ionicPlatform.ready(function () {
        app.ionicPlatformReady = true;
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
        
        
        if(ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
            $cordovaLocalNotification.hasPermission().then(function(granted){
                console.log('$cordovaLocalNotification.hasPermission.then');
                console.log(granted);
                App.notificationPermissionGranted = true;
            }).catch(function(error){
                console.log('$cordovaLocalNotification.hasPermission.catch');
                console.log(error);
                if(error === false) {
                    return $cordovaLocalNotification.registerPermission().then(function(granted){
                        console.log('$cordovaLocalNotification.registerPermission.then');
                        console.log(granted);
                        App.notificationPermissionGranted = true;
                    }).catch(function(error){
                        console.log('$cordovaLocalNotification.registerPermission.catch');
                        console.log(error);
                        throw error;
                    });
                }else{
                }
            }).then(function(){
//                console.log('Notification.then');
//                var title = sprintf('%s will be started in 15seconds!', 'Notification');
//                var id = u.localStorage.getInt('NotificationId', 0);
//                u.localStorage.set('NotificationId', id++);
//                var at = new Date(Date.now() + (15 * 1000));
//
//                $cordovaLocalNotification.schedule({
//                    'id': id,
//                    'title': title,
//                    'at': at
//                }).then(function (result) {
//                    console.log('$cordovaLocalNotification.schedule.then');
//                    console.log(result);
//                }).catch(function(error){
//                    console.log('$cordovaLocalNotification.schedule.catch');
//                    console.log(error);
//                })
            });
        }
    });
    document.addEventListener("deviceready", function () {
        app.deviceready = true;
        app.resume = true;
        $cordovaAppVersion.getVersionNumber().then(function (version) {
            app.versionNumber = version;
            app.version = new SemanticVersion(version);
        }).then(function(){
            $timeout(function() {
                return u.checkAppVersion();            
            }, 2000);
            document.addEventListener("resume", function(){
                $timeout(function() {
                    u.checkAppVersion();
                }, 1000);
            }, false);    
            document.addEventListener("pause", function () {
                app.resume = false;
            });
        });
        $cordovaAppVersion.getVersionCode().then(function (build) {
            app.versionCode = build;
        });
    }, false);
});