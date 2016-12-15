(angular => {
  'use strict';

  angular.module('mdFormValidator')
    .directive('mdFormValidator', ['$compile', mdFormValidator]);

  function mdFormValidator($compile) {

    let form_id = 0;

    return {
      restrict: 'A',
      scope: true,
      priority: 1,
      replace: false,
      terminal: true,
      controller: () => {

      },
      compile: (tElement, tAttrs, transclude) => {

        const formName = tAttrs.name || "form_" + (++form_id);

        tElement.removeAttr('md-form-validator');

        tAttrs.$set('name', formName);
        tAttrs.$set('novalidate', true);

        if (tAttrs.ngSubmit) {
          tAttrs.$set('ng-submit', "broadcastValidation() && " + formName + ".$valid && " + tAttrs.ngSubmit);
        }

        return {
          pre: (scope, iElement) => {
            scope.rootFormName = scope.formName = formName;

            scope.$on('$validate', () => {
              const form = scope[scope.formName];
              if (form) {
                form.$setSubmitted();
              }
            });

            scope.broadcastValidation = () => {
              scope.$broadcast('$validate');
              return true;
            };

            if(iElement[0].tagName.toLowerCase() != "form") {
              let parent = iElement[0];
              let form = null;

              while (parent.parentNode) {
                parent = parent.parentNode;

                if (!parent.tagName) continue;
                if (parent.tagName.toLowerCase() == "form") {
                  form = parent;
                  break;
                }
              }

              if(form) {
                scope.rootFormName = form.getAttribute('name');
              }
            }

            $compile(iElement)(scope);
          }
        };
      }
    };
  }

})(angular);
