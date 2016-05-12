'use strict';

(function (angular) {
  'use strict';

  angular.module('mdFormValidator', ['ngMessages']);
})(angular);

(function (angular) {
  'use strict';

  angular.module('mdFormValidator').provider('mdFormValidator', MdFormValidatorProvider);

  function MdFormValidatorProvider() {
    var _this = this;

    var messages = {};

    this.setMessage = function (key, message) {
      messages[key] = message;
    };

    this.getMessages = function () {
      return angular.copy(messages);
    };

    this.$get = function () {
      return _this;
    };
  }
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
          pre: function pre(scope, iElement) {
            scope.formName = formName;
            $compile(iElement)(scope);
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
        var attributes = tElement[0].attributes;

        var keys = Object.keys(attributes).reduce(function (acc, key) {
          var attr = attributes[key].name;

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

  angular.module('mdFormValidator').directive('mdMessages', ['$compile', 'mdFormValidator', mdMessages]);

  function mdMessages($compile, provider) {

    return {
      restrict: 'E',
      require: '^^mdFormValidator',
      scope: false,
      priority: 1,
      replace: true,
      transclude: true,
      template: "<div><span></span></div>",
      compile: function compile(tElement, tAttrs, transclude) {
        var $ = angular.element;

        var field = tAttrs.field || function () {
          var parent = $(tElement).parent();
          var input = parent.find('input')[0] || parent.find('select')[0] || parent.find('textarea')[0];

          return input;
        }();

        return {
          pre: function pre(scope, iElement) {
            var fieldName = $(field).attr("name");

            tAttrs.$set('ng-messages', scope.formName + '.' + fieldName + '.$error');
            tAttrs.$set('ng-show', '\n              (' + scope.formName + '.$submitted ||\n              ' + scope.formName + '.' + fieldName + '.$touched) &&\n              !' + scope.formName + '.' + fieldName + '.$valid');
            tAttrs.$set('md-auto-hide', false);

            iElement.find('span').replaceWith(transclude(scope));
            iElement.removeAttr('md-messages');

            var defaultMessages = provider.getMessages();
            Object.keys(defaultMessages).forEach(function (key) {
              var hasMessage = false;
              angular.forEach($(iElement).find('div'), function (elem) {
                if (elem.getAttribute('ng-message') == key) {
                  hasMessage = true;
                  return;
                }
              });

              if (hasMessage) return;

              var errorMessage = defaultMessages[key];
              var attrs = field.attributes;
              Object.keys(attrs).forEach(function (attr) {
                attr = attrs[attr].name;
                errorMessage = errorMessage.replace(new RegExp('{' + attr + '}', 'g'), field.getAttribute(attr));
              });

              $(iElement).append('<div ng-message="' + key + '">' + errorMessage + '</div>');
            });

            $compile(iElement)(scope);
          }
        };
      }
    };
  }
})(angular);