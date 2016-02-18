(angular => {
  'use strict';

  angular.module('md.form.validator')
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
          tAttrs.$set('ng-submit', formName + ".$valid && " + tAttrs.ngSubmit);
        }

        return {
          pre: (scope) => {
            scope.formName = formName;
            $compile(tElement)(scope);
          }
        };
      }
    };
  }

})(angular);
