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
        tElement = $(tElement);

        // const field = tAttrs.field ?
        //   $(tElement).parents('ng-form, [ng-form], .ng-form, form').eq(0).find(`[name="${tAttrs.field}"]`) :
        //   $(tElement).parent().find('input, select, textarea');

        const field = (() => {
          if (tAttrs.field) {
            let parent = tElement[0];

            while (parent.parentNode) {
              parent = parent.parentNode;

              if (parent.tagName.toLowerCase() == "ng-form" ||
                parent.hasAttribute('ng-form') ||
                parent.tagName.toLowerCase() == "form") {
                break;
              }
            }
            
            const input = parent.querySelector(`[name="${tAttrs.field}"]`);
            if(!input) throw new Error("input not found: " + tAttrs.field);
            
            return $(input);
          }

          const parent = tElement.parent();
          const input = parent.find('input')[0] ||
            parent.find('select')[0] ||
            parent.find('textarea')[0];

          return $(input);
        })();

        return {
          pre: (scope, iElement, iAttrs) => {
            const fieldName = field.attr("name");

            iAttrs.$set('ng-messages', `${scope.formName}.${fieldName}.$error`);
            iAttrs.$set('ng-show', `
              (${scope.rootFormName}.$submitted ||
              ${scope.formName}.${fieldName}.$touched) &&
              !${scope.formName}.${fieldName}.$valid`);
            iAttrs.$set('md-auto-hide', false);

            iElement.find('span').replaceWith(transclude(scope));
            iElement.removeAttr('md-messages');

            const defaultMessages = provider.getMessages();
            Object.keys(defaultMessages).forEach(key => {
              if (iElement[0].querySelector(`[ng-message="${key}"]`)) return;

              let errorMessage = defaultMessages[key];
              const attrs = field[0].attributes;
              Object.keys(attrs || {}).forEach(attr => {
                attr = attrs[attr].name;
                errorMessage = errorMessage.replace(new RegExp(`{${attr}}`, 'g'), field.attr(attr));
              });

              iElement.append(`<div ng-message="${key}">${errorMessage}</div>`);
            });

            $compile(iElement)(scope);
          }
        };

      }
    };
  }

})(angular);
