angular.module('app').directive('nsAutocomplete', [
  function() {
    return {
      restrict: 'A',
      link: function($scope, el, attr) {
        var activeIndex = 0,
            results = $scope[attr.nsAutocompleteCollection];

        el.on('keyup', function(event) {
          var key = event.which || event.keyCode;

          results = $scope[attr.nsAutocompleteCollection];

          switch(key) {
            case 38: //up
              event.preventDefault();
              setActive(activeIndex-1);
              break;
            case 40: //down
              event.preventDefault();
              setActive(activeIndex+1);
              break;
            case 13: //enter
              $scope[attr.nsAutocomplete](results[activeIndex]);
              $scope.$apply();
            default:
              return;
          }

          results[activeIndex].is_active = true;
          $scope.$apply();
        })

        function setActive(index) {
          if( index < 0 ) { index = results.length-1; }
          if( index >= results.length ) { index = 0; }

          results[activeIndex].is_active = false;
          results[index].is_active = true;
          activeIndex = index;
        }
      }
    }
  }
])
