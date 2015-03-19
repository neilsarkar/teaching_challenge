angular.module('app').controller('MovieSearchCtrl', [
  '$scope', '$nsMovie', '$nsStorage', '$location',
  function($scope, $nsMovie, $nsStorage, $location) {
    document.title = 'Search Movies';

    $scope.$watch('q', _.debounce(search, 300));
    $scope.searches = _.uniq($nsStorage.get('saved_searches'));

    $scope.showMovie = function(movie) {
      $scope.saveSearch();
      $location.path('/movies/' + movie.imdbID);
    }

    $scope.search = function(q) {
      $scope.q = q;
      search(q);
    }

    $scope.saveSearch = function() {
      $nsStorage.push('saved_searches', $scope.q);
    }

    $scope.clearSearches = function() {
      if( !window.confirm('Are you sure you want to clear your search history?') ) {
        return false;
      }

      $nsStorage.remove('saved_searches');
      $scope.searches = [];
    }

    function search(query) {
      console.log("resetting with", query);
      if( !query ) { return $scope.movies = []; }

      $scope.error = null;
      $nsMovie.search(query).then(function yes(movies) {
        $scope.movies = _.sortBy(movies, 'Year').reverse();
        if( $scope.movies[0] ) { $scope.movies[0].is_active = true; }
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
