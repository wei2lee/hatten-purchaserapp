

angular.module('route', ['ionic', 'services'])

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })
    .state('app.whatsnews', {
        url: '/whatsnews',
        views: {
            'menuContent': {
                templateUrl: 'templates/events.html',
                controller: 'WhatsNewsCtrl'
            }
        }
    })

    .state('app.whatsnewsdetail', {
        url: '/whatsnews/{id}',
        views: {
            'menuContent': {
                templateUrl: 'templates/eventdetail.html',
                controller: 'WhatsNewsDetailCtrl'
            }
        }
    })
    
    
    .state('app.purchasedproperties', {
        url: '/purchasedproperties',
        views: {
            'menuContent': {
                templateUrl: 'templates/purchasedproperties.html',
                controller: 'PurchasedPropertiesCtrl'
            }
        },
        resolve:{
            login:function(u){
                return u.sideMenuLoginOrNormalLogin();
            }
        }
    })
    .state('app.purchasedproperty', {
        url: '/purchasedproperty/{id}',
        views: {
            'menuContent': {
                templateUrl: 'templates/purchasedpropertydetail.html',
                controller: 'PurchasedPropertyDetailCtrl'
            }
        },
        resolve:{
            login:function(u){
                return u.sideMenuLoginOrNormalLogin();
            }
        }
    })
    
    .state('app.unitfloorplan', {
        url: '/unitfloorplan/{id}',
        views: {
            'menuContent': {
                templateUrl: 'templates/unitfloorplan.html',
                controller: 'UnitFloorplanCtrl'
            }
        }
    })

    .state('app.constructions', {
        url: '/constructions',
        views: {
            'menuContent': {
                templateUrl: 'templates/constructions.html',
                controller: 'ConstructionsCtrl'
            }
        }
    })

    .state('app.constructiondetail', {
        url: '/construction/{id}',
        views: {
            'menuContent': {
                templateUrl: 'templates/constructiondetail.html',
                controller: 'ConstructionDetailCtrl'
            }
        }
    })

    .state('app.properties', {
        url: '/properties',
        views: {
            'menuContent': {
                templateUrl: 'templates/properties.html',
                controller: 'PropertiesCtrl'
            }
        }
    })

    .state('app.propertydetail', {
        url: '/property/{id}',
        views: {
            'menuContent': {
                templateUrl: 'templates/propertydetail.html',
                controller: 'PropertyDetailCtrl'
            }
        }
    })
    
    .state('app.propertyspecification', {
        url: '/propertyspecification/{id}',
        views: {
            'menuContent': {
                templateUrl: 'templates/propertyspecification.html',
                controller: 'PropertySpecificationCtrl'
            }
        }
    })
    
    .state('app.propertylocation', {
        url: '/propertylocation/{id}',
        views: {
            'menuContent': {
                templateUrl: 'templates/propertylocation.html',
                controller: 'PropertyLocationCtrl'
            }
        }
    })
    
    .state('app.propertygallery', {
        url: '/propertygallery/{id}',
        views: {
            'menuContent': {
                templateUrl: 'templates/propertygallery.html',
                controller: 'PropertyGalleryCtrl'
            }
        }
    })
    
    .state('app.propertyfloorplan', {
        url: '/propertyfloorplan/{id}',
        views: {
            'menuContent': {
                templateUrl: 'templates/propertyfloorplan.html',
                controller: 'PropertyFloorplanCtrl'
            }
        }
    })
    .state('app.events', {
        url: '/events',
        views: {
            'menuContent': {
                templateUrl: 'templates/events.html',
                controller: 'EventsCtrl'
            }
        }
    })

    .state('app.eventdetail', {
        url: '/event/{id}',
        views: {
            'menuContent': {
                templateUrl: 'templates/eventdetail.html',
                controller: 'EventDetailCtrl'
            }
        }
    })
    
    .state('app.vouchers', {
        url: '/vouchers',
        views: {
            'menuContent': {
                templateUrl: 'templates/events.html',
                controller: 'VouchersCtrl'
            }
        }
    })

    .state('app.voucherdetail', {
        url: '/voucher/{id}',
        views: {
            'menuContent': {
                templateUrl: 'templates/eventdetail.html',
                controller: 'VoucherDetailCtrl'
            }
        }
    })
    
    .state('app.tickets', {
        url: '/tickets',
        views: {
            'menuContent': {
                templateUrl: 'templates/tickets.html',
                controller: 'TicketsCtrl'
            }
        }
    })

    .state('app.ticket', {
        url: '/ticket/{id}',
        views: {
            'menuContent': {
                templateUrl: 'templates/ticket.html',
                controller: 'TicketCtrl'
            }
        }
    })
    

    .state('app.calculator', {
        url: '/calculator',
        views: {
            'menuContent': {
                templateUrl: 'templates/calculator.html',
                controller: 'CalculatorCtrl'
            }
        }
    })

    .state('app.feedbacks', {
        url: '/feedbacks',
        views: {
            'menuContent': {
                templateUrl: 'templates/feedbacks.html'
            }
        }
    })

    .state('app.consultants', {
        url: '/consultants',
        views: {
            'menuContent': {
                templateUrl: 'templates/consultants.html',
                controller: 'ConsultantsCtrl'
            }
        }
    })

    .state('app.consultants-where-project', {
        url: '/consultants/where-project/{projectId}',
        views: {
            'menuContent': {
                templateUrl: 'templates/consultants-where-project.html',
                controller: 'ConsultantsWhereProjectCtrl'
            }
        }
    })

    .state('app.consultantdetail', {
        url: '/consultant/{id}',
        views: {
            'menuContent': {
                templateUrl: 'templates/consultantdetail.html',
                controller: 'ConsultantDetailCtrl'
            }
        }
    })


    .state('app.privacypolicy', {
        url: '/privacypolicy',
        views: {
            'menuContent': {
                templateUrl: 'templates/privacypolicy.html',
                controller: 'PolicyCtrl'
            }
        }
    })

    .state('app.termsandcondition', {
        url: '/termsandcondition',
        views: {
            'menuContent': {
                templateUrl: 'templates/termsandcondition.html',
                controller: 'TNCCtrl'
            }
        }
    })

    .state('app.pdpa', {
        url: '/pdpa',
        views: {
            'menuContent': {
                templateUrl: 'templates/pdpa.html',
                controller: 'PDPACtrl'
            }
        }
    })

    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            }
        },
        resolve:{
            login:function(u){
                return u.sideMenuLoginOrNormalLogin();
            }
        }
    })

    .state('app.aboutus', {
        url: '/aboutus',
        views: {
            'menuContent': {
                templateUrl: 'templates/aboutus.html',
                controller: 'AboutUsCtrl'
            }
        }
    })
    
    .state('app.learnmore', {
        url: '/learnmore',
        views: {
            'menuContent': {
                templateUrl: 'templates/common/learnmore.html',
                controller: 'LearnMoreCtrl'
            }
        }
    })
    
    .state('app.web', {
        url: '/web',
        views: {
            'menuContent': {
                templateUrl: 'templates/common/web.html',
                controller: 'WebCtrl'
            }
        }
    })

    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/whatsnews');
})
.config(function($ionicConfigProvider) {  
    //$ionicConfigProvider.views.maxCache(1);
//    $ionicConfigProvider.scrolling.jsScrolling(false)
})
.run(function(
     $rootScope, 
      u, 
      apiUser,
      $state, 
      $location, 
      $templateCache,
      $http,
      intent,
      app, 
      apiService,
      $ionicSideMenuDelegate,
      $ionicViewService){
    
    //preload templates
    $http.get('templates/common/rate-review.html', { cache: $templateCache });
    
    //setup global variables that can access from view (by assign it to rootScope);
    console.log(apiService);
    $rootScope.$ionicSideMenuDelegate = $ionicSideMenuDelegate;
    $rootScope.apiService = apiService;
    $rootScope.app = app;
    $rootScope.intent = intent;
    $rootScope.$state = $state;
    $rootScope.u = u;
    $rootScope.apiUser = apiUser;
    $rootScope.ionicPlatform = ionic.Platform;
});