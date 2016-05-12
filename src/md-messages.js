(angular => {
  'use strict';

  angular.module('mdFormValidator')
    .directive('mdMessages', ['$compile', 'mdFormValidator', mdMessages]);

  function mdMessages($compile, provider) {

    return {
      restrict: 'E',
      require: '^^mdFormValidator',
      scope: false,
      priority: 1,
      replace: true,
      transclude: true,
      template: "<div><span></span></div>",
      compile: (tElement, tAttrs, transclude) => {
        const $ = angular.element;

        const field = tAttrs.field || (() => {
          const parent = $(tElement).parent();
          const input = parent.find('input')[0] ||
            parent.find('select')[0] ||
            parent.find('textarea')[0];

          return $(input).attr('name');
        })();

        return {
          pre: (scope, iElement) => {

            tAttrs.$set('ng-messages', `${scope.formName}.${field}.$error`);
            tAttrs.$set('ng-show', `
              (${scope.formName}.$submitted ||
              ${scope.formName}.${field}.$touched) &&
              !${scope.formName}.${field}.$valid`);
            tAttrs.$set('md-auto-hide', false);

            iElement.find('span').replaceWith(transclude(scope));
            iElement.removeAttr('md-messages');

            const defaultMessages = provider.getMessages();
            Object.keys(defaultMessages).forEach(key => {
              let hasMessage = false;
              angular.forEach($(iElement).find(`div`), elem => {
                if (elem.getAttribute('ng-message') == key) {
                  hasMessage = true;
                  return;
                }
              });

              if (hasMessage) return;
              $(iElement).append(`<div ng-message="${key}">${defaultMessages[key]}</div>`);
            });

            $compile(iElement)(scope);
          }
        };

      }
    };
  }

})(angular);
