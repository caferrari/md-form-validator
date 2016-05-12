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

          return input;
        })();


        return {
          pre: (scope, iElement) => {
            const fieldName = $(field).attr("name");

            tAttrs.$set('ng-messages', `${scope.formName}.${fieldName}.$error`);
            tAttrs.$set('ng-show', `
              (${scope.formName}.$submitted ||
              ${scope.formName}.${fieldName}.$touched) &&
              !${scope.formName}.${fieldName}.$valid`);
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

              let errorMessage = defaultMessages[key];
              const attrs = field.attributes;
              Object.keys(attrs || {}).forEach(attr => {
                attr = attrs[attr].name;
                errorMessage = errorMessage.replace(new RegExp(`{${attr}}`, 'g'), field.getAttribute(attr));
              });

              $(iElement).append(`<div ng-message="${key}">${errorMessage}</div>`);
            });

            $compile(iElement)(scope);
          }
        };

      }
    };
  }

})(angular);
