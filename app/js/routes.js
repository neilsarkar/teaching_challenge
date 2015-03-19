angular.module('app').config([
  '$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'templates/search.html',
        controller: 'MovieSearchCtrl'
      }).
      otherwise({
        redirectTo: '/'
      })
  }
])
