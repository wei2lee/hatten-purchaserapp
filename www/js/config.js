angular.module('route', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {
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
  
;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/whatsnew');
});
