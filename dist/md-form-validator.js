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
          tAttrs.$set('ng-submit', "broadcastValidation() && " + formName + ".$valid && " + tAttrs.ngSubmit);
        }

        return {
          pre: function pre(scope, iElement) {
            scope.formName = formName;

            scope.$on('$validate', function () {
              var form = scope[scope.formName];
              if (form) {
                form.$setSubmitted();
              }
            });

            scope.broadcastValidation = function () {
              scope.$broadcast('$validate');
              return true;
            };

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
        tElement = $(tElement);

        // const field = tAttrs.field ?
        //   $(tElement).parents('ng-form, [ng-form], .ng-form, form').eq(0).find(`[name="${tAttrs.field}"]`) :
        //   $(tElement).parent().find('input, select, textarea');

        var field = function () {
          if (tAttrs.field) {
            var _parent = tElement[0];

            while (_parent.parentNode) {
              _parent = _parent.parentNode;

              if (!_parent.tagName) continue;
              if (_parent.tagName.toLowerCase() == "ng-form" || _parent.hasAttribute('ng-form') || _parent.tagName.toLowerCase() == "form") {
                break;
              }
            }

            var _input = _parent.querySelector('[name="' + tAttrs.field + '"]');

            return $(_input);
          }

          var parent = tElement.parent();
          var input = parent.find('input')[0] || parent.find('select')[0] || parent.find('textarea')[0];

          return $(input);
        }();

        if (!field) {
          throw new Error("field not found: " + tAttrs.field);
        }

        return {
          pre: function pre(scope, iElement, iAttrs) {
            var fieldName = field.attr("name");

            iAttrs.$set('ng-messages', scope.formName + '.' + fieldName + '.$error');
            iAttrs.$set('ng-show', '\n              (' + scope.formName + '.$submitted ||\n              ' + scope.formName + '.' + fieldName + '.$touched) &&\n              !' + scope.formName + '.' + fieldName + '.$valid');
            iAttrs.$set('md-auto-hide', false);

            iElement.find('span').replaceWith(transclude(scope));
            iElement.removeAttr('md-messages');

            var defaultMessages = provider.getMessages();
            Object.keys(defaultMessages).forEach(function (key) {
              if (iElement[0].querySelector('[ng-message="' + key + '"]')) return;

              var errorMessage = defaultMessages[key];
              var attrs = field[0].attributes;
              Object.keys(attrs || {}).forEach(function (attr) {
                if (!attrs[attr]) return;
                attr = attrs[attr].name;
                errorMessage = errorMessage.replace(new RegExp('{' + attr + '}', 'g'), field.attr(attr));
              });

              iElement.append('<div ng-message="' + key + '">' + errorMessage + '</div>');
            });

            $compile(iElement)(scope);
          }
        };
      }
    };
  }
})(angular);