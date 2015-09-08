angular.module('route', ['ionic'])

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })
    .state('app.whatsnew', {
        url: '/whatsnew',
        views: {
            'menuContent': {
                templateUrl: 'templates/whatsnew.html',
                controller: 'WhatsNewCtrl'
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
        }
    })
    .state('app.purchasedproperty', {
        url: '/purchasedproperty/{id}',
        views: {
            'menuContent': {
                templateUrl: 'templates/purchasedpropertydetail.html',
                controller: 'PurchasedPropertyDetailCtrl'
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
        url: '/propertyspecification',
        views: {
            'menuContent': {
                templateUrl: 'templates/propertyspecification.html',
                controller: 'PropertySpecificationCtrl'
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

    .state('app.aboutdetail', {
        url: '/aboutdetail',
        views: {
            'menuContent': {
                templateUrl: 'templates/aboutdetail.html',
                controller: 'AboutDetailCtrl'
            }
        }
    })
    
    .state('app.learnmore', {
        url: '/learnmore',
        views: {
            'menuContent': {
                templateUrl: 'templates/learnmore.html',
                controller: 'LearnMoreCtrl'
            }
        }
    })

    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/whatsnew');
})
.config(function($ionicConfigProvider) {  
    //$ionicConfigProvider.views.maxCache(1);
})
.run(function($rootScope, u, apiUser,$state, $templateCache,$http,intent,app){
    //preload templates
    $http.get('templates/common/rate-review.html', { cache: $templateCache });
    //setup global variables that can access from view (by assign it to rootScope);
    $rootScope.app = app;
    $rootScope.intent = intent;
    $rootScope.$state = $state;
    $rootScope.u = u;
    $rootScope.apiUser = apiUser;
    $rootScope.ionicPlatform = ionic.Platform;
});