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
        const attributes = tElement[0].attributes;

        const keys = Object.keys(attributes).reduce((acc, key) => {
          const attr = attributes[key].name;

          if (attr[0] !== '$') {
            tElement.removeAttr(attr);
            acc.push(attr);
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
