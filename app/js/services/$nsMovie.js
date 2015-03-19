angular.module('app').service('$nsMovie', [
  '$http', '$q',
  function($http, $q) {
    var self = this;

    self.search = function(query) {
      return $http({
        method: 'GET',
        url: 'http://www.omdbapi.com/',
        params: { s: query }
      }).then(function(response) {
        if( response.Error ) { return $q.reject({error: response.Error}); }
        return response.data.Search;
      })
    }
  }
])
