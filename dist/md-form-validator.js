'use strict';

(function (angular) {
  'use strict';

  angular.module('mdFormValidator', ['ngMessages']);
})(angular);

(function (angular) {
  'use strict';

  angular.module('mdFormValidator').directive('mdFormValidator', ['$compile', mdFormValidator]);

  function mdFormValidator($compile) {

    var form_id = 0;

    return {
      restrict: 'A',
      scope: true,
      priority: 1,
      replace: false,
      terminal: true,
      controller: function controller() {},
      compile: function compile(tElement, tAttrs, transclude) {

        var formName = tAttrs.name || "form_" + ++form_id;

        tElement.removeAttr('md-form-validator');

        tAttrs.$set('name', formName);
        tAttrs.$set('novalidate', true);

        if (tAttrs.ngSubmit) {
          tAttrs.$set('ng-submit', formName + ".$valid && " + tAttrs.ngSubmit);
        }

        return {
          pre: function pre(scope) {
            scope.formName = formName;
            $compile(tElement)(scope);
          }
        };
      }
    };
  }
})(angular);

(function (angular) {
  'use strict';

  angular.module('mdFormValidator').directive('mdMessage', mdMessage);

  function mdMessage() {
    return {
      restrict: 'E',
      priority: 1,
      replace: true,
      transclude: true,
      template: "<div><span></span></div>",
      terminal: true,
      compile: function compile(tElement, tAttrs, transclude) {

        tElement.removeAttr('md-message');

        var keys = Object.keys(tAttrs).reduce(function (acc, key) {
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
          pre: function pre(scope) {
            tAttrs.$set('ng-message', keys);
            tElement.find('span').replaceWith(transclude(scope));
          }
        };
      }
    };
  }
})(angular);

(function (angular) {
  'use strict';

  angular.module('mdFormValidator').directive('mdMessages', ['$compile', mdMessages]);

  function mdMessages($compile) {

    return {
      restrict: 'E',
      require: '^^mdFormValidator',
      scope: false,
      priority: 1,
      replace: true,
      transclude: true,
      template: "<div><span></span></div>",
      compile: function compile(tElement, tAttrs, transclude) {

        var field = tAttrs.field || function () {
          var $ = angular.element;
          var parent = $(tElement).parent();
          var input = parent.find('input')[0] || parent.find('select')[0] || parent.find('textarea')[0];

          return $(input).attr('name');
        }();

        tElement.removeAttr('md-messages');

        return {
          pre: function pre(scope) {

            tAttrs.$set('ng-messages', scope.formName + '.' + field + '.$error');
            tAttrs.$set('ng-show', '\n              (' + scope.formName + '.$submitted ||\n              ' + scope.formName + '.' + field + '.$touched) &&\n              !' + scope.formName + '.' + field + '.$valid');
            tAttrs.$set('md-auto-hide', false);

            tElement.find('span').replaceWith(transclude(scope));

            $compile(tElement)(scope);
          }
        };
      }
    };
  }
})(angular);