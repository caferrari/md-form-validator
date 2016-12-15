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
            scope.formName = formName;

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

            $compile(iElement)(scope);
          }
        };
      }
    };
  }

})(angular);
