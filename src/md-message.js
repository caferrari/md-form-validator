(angular => {
  'use strict';

  angular.module('mdFormValidator')
  .directive('mdMessage', mdMessage);

  function mdMessage() {
    return {
      restrict: 'E',
      priority: 1,
      replace: true,
      transclude: true,
      template: "<div><span></span></div>",
      terminal: true,
      compile: (tElement, tAttrs, transclude) => {

        tElement.removeAttr('md-message');

        const keys = Object.keys(tAttrs).reduce((acc, key) => {
          if (key[0] !== '$') {
            tElement.removeAttr(key);
            acc.push(key);
          }
          return acc;
        }, []).join(',');

        if (!keys) {
          throw Error('at least one validator must be provided');
        }

        return {
          pre: (scope) => {
            tAttrs.$set('ng-message', keys);
            tElement.find('span').replaceWith(transclude(scope));
          }
        };
      }
    };
  }

})(angular);
