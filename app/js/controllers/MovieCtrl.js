angular.module('app').controller('MovieCtrl', [
  '$scope', '$routeParams', '$nsMovie',
  function($scope, $routeParams, $nsMovie) {

    $nsMovie.find($routeParams.imdbId).then(function yes(movie) {
      document.title = movie.Title;
      $scope.movie = movie;
    }, function no() {
      alert("Couldn't find movie.");
    })
  }
]);
