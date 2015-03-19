angular.module('app').controller('MovieSearchCtrl', [
  '$scope', '$nsMovie',
  function($scope, $nsMovie) {
    $scope.$watch('q', _.debounce(search, 300));
    function search(query) {
      if( !query ) { return $scope.movies = []; }

      $scope.error = null;
      $nsMovie.search(query).then(function yes(movies) {
        $scope.movies = movies;
      }, function no(xhr) {
        if( xhr.error ) {
          $scope.error = xhr.error;
        } else {
          $scope.error = "Sorry, we couldn't fetch movies.";
        }
        console.error(xhr);
      })
    }
  }
])
