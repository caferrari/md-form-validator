angular.module('sbrubles', [
    'ngMaterial',
    'ngMessages',
    'mdFormValidator',
    'validatorEquals',
    'validatorAsync'
  ])
  .config(['mdFormValidatorProvider', function (mdFormValidatorProvider) {
    mdFormValidatorProvider.setMessage("required", "Obrigatório");
    mdFormValidatorProvider.setMessage("md-maxlength", "Limite {md-maxlength}");
  }])
  .controller('homeCtrl', function ($q, $timeout, $scope) {
    $scope.form = {};
    $scope.rows = [{}, {}, {}];

    $scope.validateEmail = function (email) {
      var defered = $q.defer();
      $timeout((email === 'asd@gmail.com' ? defered.reject : defered.resolve), 2000);
      return defered.promise;
    };

    $scope.submitMyData = function () {
      alert('data submitted!');
    };

    $scope.set = function () {
      $scope.form.ctrl.$setSubmitted(true);
    }
  });