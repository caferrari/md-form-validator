(angular => {
  'use strict';

  angular.module('mdFormValidator')
    .provider('mdFormValidator', MdFormValidatorProvider);

  function MdFormValidatorProvider() {
    const messages = {};

    this.setMessage = (key, message) => {
      messages[key] = message;
    };

    this.getMessages = () => {
      return angular.copy(messages);
    };

    this.$get = () => {
      return this;
    };
  }

})(angular);
