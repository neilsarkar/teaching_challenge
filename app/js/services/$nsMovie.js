angular.module('app').service('$nsMovie', [
  '$http', '$q',
  function($http, $q) {
    var self = this,
        BASE_URL = 'http://www.omdbapi.com/';

    self.search = function(query) {
      return $http({
        method: 'GET',
        url: BASE_URL,
        params: { s: query, type: 'movie' }
      }).then(function(response) {
        if( response.Error ) { return $q.reject({error: response.Error}); }
        return response.data.Search;
      })
    },

    self.find = function(imdbId) {
      return $http({
        method: 'GET',
        url: BASE_URL,
        params: { i: imdbId }
      }).then(function(response) {
        if( response.Error ) { return $q.reject({error: response.Error}); }

        response.data.Poster = '/imageproxy?cool=' + response.data.Poster;
        return response.data;
      })
    }
  }
])
