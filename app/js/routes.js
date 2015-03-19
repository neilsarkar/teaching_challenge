angular.module('app').config([
  '$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider.
      when('/', {
        templateUrl: 'templates/search.html',
        controller: 'MovieSearchCtrl'
      }).
      when('/movies/:imdbId', {
        templateUrl: 'templates/movie.html',
        controller: 'MovieCtrl'
      }).
      otherwise({
        redirectTo: '/'
      })
  }
])
