// A thin wrapper over local
angular.module('app').service('$nsStorage', [
  function() {
    var self = this;

    if( !window.localStorage ) {
      return self.set = self.get = self.remove = function noop(){};
    }

    self.set = function(key, value) {
      window.localStorage.setItem(key, value);
    }

    self.get = function(key) {
      return JSON.parse(window.localStorage.getItem(key) || false);
    }

    self.remove = function(key) {
      return window.localStorage.removeItem(key);
    }

    self.push = function(key, value) {
      var currentVal = self.get(key) || [];
      currentVal.push(value);
      self.set(key, JSON.stringify(currentVal));
    }
  }
])
