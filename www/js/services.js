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

.value('googleApiKey', 'AIzaSyAZU6hYAxURw1ewJYV4OMLitTYd01xPb0I')
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
        apiWhatsNews,
        apiVoucher,
        Popup,
        $ionicLoading,
        $cordovaSocialSharing,
        $cordovaAppRate,
        $cordovaProgress,
        $cordovaAppVersion,
        $ionicSideMenuDelegate,
        $ionicViewService,
        $ionicHistory,
        apiCountry,
        apiTitle,
        app,
        apiApp,
        $window
    ) {
        var _this = this;

        /* ==========================================================================
           Form Select Options
           ========================================================================== */
        /* ==========================================================================
           Login
           ========================================================================== */

        this.closeLogin = function () {
            $rootScope.loginModal.modal.hide();
        };
        this.openLogin = function () {
            if (apiUser.getUser()) {
                return $q(function (resolve, reject) {
                    resolve(apiUser.getUser());
                });
            }

            var vm = $rootScope;
            vm.loginModal = {};

            vm.loginModal.forgetPassword = function () {
                if (apiUser.getUser()) {
                    return $q(function (resolve, reject) {
                        reject(createError("Already login"));
                    });
                }
                if (!forgetPasswordData.EmailAddress) {
                    return $q(function (resolve, reject) {
                        reject(createError("Email Address cannot be empty"));
                    });
                }
                _this.showProgress();
                return apiUser.forgetPassword(forgetPasswordData.EmailAddress).then(function () {
                    _this.showAlert("Your password is sent to your email");
                }).catch(function (error) {
                    _this.showAlert(error.description);
                }).finally(function () {
                    _this.hideProgress();
                });

                //            _this.showProgress();
                //            $timeout(function(){
                //                _this.showAlert("Your password is sent to your email");
                //                _this.hideProgress();
                //            },1500)
                //            return;   
            }


            vm.loginModal.tab = 0;
            vm.loginModal.loginAlert = null;
            vm.loginModal.loginData = {};
            //        vm.loginModal.loginData.username = 'TAREN.SUNIL@YAHOO.COM';
            //        vm.loginModal.loginData.password = 'wendyjsy';
            //        vm.loginModal.loginData.username = 'ivantan31@hotmail.com';
            //        vm.loginModal.loginData.password = 'test';
            vm.loginModal.loginData.username = 'apps@infradigital.com.my';
            vm.loginModal.loginData.password = 'Hattengroup';

            vm.loginModal.signUpAlert = null;
            vm.loginModal.signUpData = {};
            vm.loginModal.signUpData.Title = vm.titleOptions ? vm.titleOptions[0] : null;

            vm.loginModal.forgetPasswordAlert = null;
            vm.loginModal.forgetPasswordData = {};

            var loadCountryOptions = apiCountry.getAll().then(function (results) {
                vm.loginModal.callingCodeOptions = results;
            })
            var loadTitleOptions = apiTitle.getAll().then(function (results) {
                vm.loginModal.titleOptions = results;
            })
            var loadLoginModal = $ionicModal.fromTemplateUrl('templates/common/login.html', {
                scope: vm
            }).then(function (modal) {
                vm.loginModal.modal = modal;
            });
            return $q.all([loadCountryOptions, loadTitleOptions, loadLoginModal]).then(function () {
                vm.loginModal.signUpData.Title = vm.loginModal.titleOptions ? vm.loginModal.titleOptions[0] : null;
                if (vm.loginModal.callingCodeOptions) {
                    var found = _.find(vm.loginModal.callingCodeOptions, function (o) {
                        return o.CountryCode == 'MY';
                    });
                    vm.loginModal.signUpData.CallingCode = found ? found.CallingCode : vm.loginModal.callingCodeOptions[0].CallingCode;
                }

                $ret = vm.loginModal.modal.show();
                return $q(function (resolve, reject) {
                    $ret = vm.$on('modal.hidden', function () {
                        $ret();
                        if (apiUser.getUser()) {
                            resolve(apiUser.getUser());
                        } else {
                            reject(createError('Not login'));
                        }
                    });
                });
            });
        }
        this.doLogout = function () {
            apiUser.logout();
            var currentstate = _.find($state.get(), function (o) {
                return o.name == $state.current.name;
            });
            if (currentstate) {
                if (currentstate.resolve && currentstate.resolve.login) {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true,
                        disableAnimate: true,
                        expire: 300
                    });
                    $ionicSideMenuDelegate.toggleLeft(false);
                    $state.go("app.whatsnews");
                }
            }
            Popup.alert({
                'title': 'You have logout',
                'buttons': [{
                    'text': 'Close',
                    'type': 'button-positive'
                    }]
            });
        }
        this.doLogin = function () {
            var vm = $rootScope;
            _this.showProgress();
            return apiUser.login(vm.loginModal.loginData.username, vm.loginModal.loginData.password).then(function (results) {
                _this.closeLogin();
            }).catch(function (error) {
                vm.loginModal.loginAlert = {
                    message: error.description
                }
                throw error;
            }).finally(function () {
                _this.hideProgress();
            });
        };

        this.doSignUp = function () {
            console.log("doSignUp");
            var vm = $rootScope;
            _this.showProgress();
            return apiUser.signUp(vm.loginModal.signUpData).then(function (results) {
                _this.closeLogin();
            }).catch(function (error) {
                vm.loginModal.signUpAlert = {
                    message: error.description
                }
                throw error;
            }).finally(function () {
                _this.hideProgress();
            });
        };


        this.sideMenuLogin = function () {
            if (!apiUser.getUser()) {
                return _this.openLogin().then(function () {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true,
                        disableAnimate: true,
                        expire: 300
                    });
                    $ionicSideMenuDelegate.toggleLeft(false);
                }).catch(function (error) {
                    throw error;
                });
            } else {
                return $q(function (resolve, reject) {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true,
                        disableAnimate: true,
                        expire: 300
                    });
                    $ionicSideMenuDelegate.toggleLeft(false);
                    resolve();
                });
            }
        }

        this.sideMenuLoginOrNormalLogin = function () {
            if ($ionicSideMenuDelegate.isOpenLeft()) {
                return _this.sideMenuLogin();
            } else {
                if (!apiUser.getUser()) {
                    return _this.openLogin();
                } else {
                    return $q(function (resolve, reject) {
                        resolve(apiUser.getUser());
                    });
                }
            }
        }

        this.closeSideMenuIfLogon = function () {
            if (apiUser.getUser()) {
                $ionicSideMenuDelegate.toggleLeft(false)
            }
        }

        /* ==========================================================================
           Show Progress, Error
           ========================================================================== */
        this.showProgress = function () {
            $ionicLoading.show({
                delay: 300,
                templateUrl: 'templates/common/loading.html'
            });
        }
        this.hideProgress = function () {
            $ionicLoading.hide();
        }

        this.showError = function (error) {

        }

        this.showAlert = function (title, msg, buttonType) {
            if (buttonType === undefined || buttonType === null) buttonType = 'button-positive';
            var alertPopup = Popup.alert({
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

        this.shareEventBase = function (event) {
            if (window.cordova === undefined) {
                return $q(function (resolve, reject) {
                    resolve();
                });
            }
            var message = event.RoadShow.Name;
            var subject = event.RoadShow.Name;
            var file = event.RoadShow.EventSmallPhotoResourceKey;
            var link = event.RoadShow.WhatNewsClickUrl || undefined;
            return $cordovaSocialSharing
                .share(message, subject, file, link) // Share via native share sheet
                .then(function (result) {
                    // Success!
                }, function (err) {
                    // An error occured. Show a message to the user
                });
        }


        this.shareEvent = function (event) {
            this.shareEventBase(event);
        }

        this.shareWhatsNews = function (event) {
            this.shareEventBase(event);
        }

        this.shareVoucher = function (event) {
            this.shareEventBase(event);
        }

        this.shareProperty = function (o) {
            if (window.cordova === undefined) {
                return $q(function (resolve, reject) {
                    resolve();
                });
            }
            var message = o.Name;
            var subject = o.Name;
            var file = o.PictureSmallResourceKey;
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
        this.rateApp = function () {
                if (window.cordova === undefined) {
                    var defer = $q.defer();
                    $q.resolve();
                    return defer.promise;
                }
                return $cordovaAppRate.promptForRating(true).then(function (result) {
                    // success
                });
            }
            /* ==========================================================================
               Application Specified Rating
               ========================================================================== */
        this.createRate = function (o, title) {
                var ret = {
                    'apiUser': apiUser,
                    'title': title,
                    setRate: function (i) {
                        var _self = this;
                        var oldval = Math.floor(this.rate);
                        var newval;
                        if (oldval == i && oldval > 1) {
                            newval = oldval - 1;
                        } else {
                            newval = i;
                        }
                        if (oldval == newval) return;
                        if (apiUser.getUser()) {
                            _self.rate = newval;
                            if (_self.rateFor)
                                _self.rateFor(newval)
                        } else {
                            _this.openLogin().then(function () {
                                if (apiUser.getUser()) {
                                    _self.rate = newval;
                                    if (_self.rateFor)
                                        _self.rateFor(newval)
                                }
                            });
                        }
                    },
                    rate: -1,
                    review: {
                        averageRate: 0,
                        totalPeople: 0,
                        totalRatePerStars: [0, 0, 0, 0, 0],
                        getTotalRateStars: function () {
                            return _.max(this.totalRatePerStars);
                        },
                        getChartWidth: function (i) {
                            if (this.getTotalRateStars() == 0) {
                                return '0%';
                            } else {
                                return (this.totalRatePerStars[i] / this.getTotalRateStars()) * 100 + '%';
                            }
                        }
                    }
                };
                ret.review.totalPeople = _.reduce(ret.review.totalRatePerStars, function (s, o) {
                    return s + o;
                });
                ret.rateFor = function (star) {
                    if (ret.project) {
                        return ret.rateForProject(ret.project, star);
                    } else if (ret.consultant) {
                        return ret.rateForConsultant(ret.consultant, star);
                    } else if (ret.event) {
                        return ret.rateForEvent(ret.event, star);
                    } else if (ret.whatsnews) {
                        return ret.rateForWhatsNews(ret.whatsnews, star);
                    } else if (ret.voucher) {
                        return ret.rateForVoucher(ret.voucher, star);
                    } else {
                        return $q(function (resolve, reject) {
                            reject('Invalid rateFor object');
                        });
                    }
                }
                ret.setRateFrom = function (o) {
                    if (o.EventId) {
                        o = o.RoadShow;
                    }
                    ret.rate = o.RateValue || -1;
                    ret.review.averageRate = o.AverRate || 0;
                    ret.review.totalPeople = o.Total || 0;
                    ret.review.totalRatePerStars[4] = o.Total1 || o.Star1 || 0;
                    ret.review.totalRatePerStars[3] = o.Total2 || o.Star2 || 0;
                    ret.review.totalRatePerStars[2] = o.Total3 || o.Star3 || 0;
                    ret.review.totalRatePerStars[1] = o.Total4 || o.Star4 || 0;
                    ret.review.totalRatePerStars[0] = o.Total5 || o.Star5 || 0;
                }


                ret.rateForObject = function (o, star, api) {
                    if (ret.apiUser.getUser() == null) {
                        return $q(function (resolve, reject) {
                            reject(createError('Not logon'));
                        });
                    }
                    return api.rate(o, ret.apiUser.getUser(), star).then(function (results) {
                        $timeout(function () {
                            ret.setRateFrom(results);
                        });
                    }).catch(function (error) {
                        _this.showAlert(error.description);
                        throw error;
                    });
                }
                ret.setRateFromObject = function (o, propertyName) {
                    ret[propertyName] = o;
                    return ret.setRateFrom(o);
                }
                ret.getRateForObject = function (o, api) {
                        if (ret.apiUser.getUser() == null) {
                            return $q(function (resolve, reject) {
                                reject(createError('Not logon'));
                            });
                        }
                        return api.getRate(o, ret.apiUser.getUser()).then(function (results) {
                            ret.setRateFrom(results);
                        }).catch(function (error) {
                            _this.showAlert(error.description);
                            throw error;
                        });
                    }
                    //Rate for Event
                ret.rateForEvent = function (o, star) {
                    return ret.rateForObject(o, star, apiEvent);
                }
                ret.setRateFromEvent = function (o) {
                    return ret.setRateFromObject(o, 'event');
                }
                ret.getRateForEvent = function (o) {
                        return ret.getRateForObject(o, apiEvent);
                    }
                    //Rate for WhatsNews
                ret.rateForWhatsNews = function (o, star) {
                    return ret.rateForObject(o, star, apiWhatsNews);
                }
                ret.setRateFromWhatsNews = function (o) {
                    return ret.setRateFromObject(o, 'whatsnews');
                }
                ret.getRateForWhatsNews = function (o) {
                        return ret.getRateForObject(o, apiWhatsNews);
                    }
                    //Rate for Voucher
                ret.rateForVoucher = function (o, star) {
                    return ret.rateForObject(o, star, apiVoucher);
                }
                ret.setRateFromVoucher = function (o) {
                    return ret.setRateFromObject(o, 'voucher');
                }
                ret.getRateForVoucher = function (o) {
                        return ret.getRateForObject(o, apiVoucher);
                    }
                    //Rate for Project
                ret.rateForProject = function (o, star) {
                    return ret.rateForObject(o, star, apiProperty);
                }
                ret.setRateFromProject = function (o) {
                    return ret.setRateFromObject(o, 'project');
                }
                ret.getRateForProject = function (o) {
                        return ret.getRateForObject(o, apiProperty);
                    }
                    //Rate for Consultant
                ret.rateForConsultant = function (o, star) {
                    return ret.rateForObject(o, star, apiConsultant);
                }
                ret.setRateFromConsultant = function (o) {
                    return ret.setRateFromObject(o, 'consultant');
                }
                ret.getRateForConsultant = function (o) {
                    return ret.getRateForObject(o, apiConsultant);
                }


                return ret;
            }
            /* ==========================================================================
               Timer
               ========================================================================== */
        this.createTimer = function (f) {
            var ret = {};
            ret.updateExpireRemain = f;
            ret.updateExpireRemainInterval = null;
            ret.start = function () {
                if (ret.updateExpireRemainInterval) return;
                ret.updateExpireRemainInterval = $interval(function () {
                    if (ret.updateExpireRemain)
                        ret.updateExpireRemain();
                }, 500);
            }
            ret.stop = function () {
                if (!ret.updateExpireRemainInterval) return;
                $interval.cancel(ret.updateExpireRemainInterval);
                ret.updateExpireRemainInterval = null;
            }
            return ret;
        }

        /* ==========================================================================
           Set Intent and Go to state
           ========================================================================== */
        this.navigateToStateWithIntent = function (state, item) {
            intent.item = item;
            $state.go(state);
        }

        this.disableBack = function () {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
        }

        /* ==========================================================================
           Get App Version
           ========================================================================== */

        this.getAppInfo = function () {
            return apiApp.get();
        }
        this.checkAppVersion = function () {
                var vm = $rootScope;
                vm.newVersionModal = {};
                vm.close = function () {
                        vm.newVersionModal.modal.hide();
                    }
                    //        vm.newVersionModal.loadModal = $ionicModal.fromTemplateUrl('templates/common/newversion.html', {
                    //            scope: vm
                    //        }).then(function (modal) {
                    //            vm.newVersionModal.modal = modal;
                    //        });
                    //        vm.newVersionModal.loadModal.then(function() {
                    //            apiApp.get().then(function(result) {
                    //                var appstoreversion = new SemanticVersion(result.version);
                    //                var appversion = app.version;
                    //                if(appstoreversion.compare(appversion) > 0) {
                    //                    vm.newVersionModal.modal.show();
                    //                }
                    //            }); 
                    //        });
                apiApp.get().then(function (result) {
                    var appstoreversion = new SemanticVersion(result.version);
                    var appversion = app.version;
                    if (appstoreversion.compare(appversion) > 0) {
                        Popup.alert({
                            'title': 'New Version',
                            'template': 'New version (' + appstoreversion.toString() + ') is available',
                            'buttons': [{
                                'text': 'Download',
                                'type': 'button-positive',
                                'onTap': function (e) {
                                    window.open(result.downloadsrc, '_system', 'location=yes');
                                }
                    }, {
                                'text': 'Close',
                                'type': 'button-default'
                    }]
                        }).then(function () {

                        });
                    }
                });
            }
            /* ==========================================================================
               Promise for loading images
               ========================================================================== */

        this.imagesLoaded = function ($imgs) {
            return $q(function (resolve, reject) {
                $timeout(function () {
                    var loadcnt = 0;
//                    console.log('image load : imgs.length = ' + $imgs.length);
                    $imgs.one('load', function () {
//                        console.log('image loaded');
                        loadcnt++;
                        if (loadcnt == $imgs.length) {
//                            console.log('image all loaded');
                            resolve();
                        }
                    }).each(function () {
                        if (this.complete) $(this).load();
                    });
                });
            });
        };

        this.localStorage = {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                var strval = $window.localStorage[key]
                if(strval === undefined || strval === null){
                    this.set(key, defaultValue);
                    return defaultValue; 
                }else{
                    return strval; 
                }
            },
            setInt: function (key, value) {
                $window.localStorage[key] = ''+value;
            },
            getInt: function (key, defaultValue) {
                var strval = $window.localStorage[key]
                if(strval === undefined || strval === null){
                    this.set(key, ''+defaultValue);
                    return defaultValue; 
                }else{
                    return parseInt(strval); 
                }
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key, defaultValue) {
                var strval = $window.localStorage[key]
                if(strval === undefined || strval === null){
                    this.setObject(key, defaultValue);
                    return defaultValue; 
                }else{
                    return JSON.parse(strval);
                }
            }
        }
    });