Angular Material Design Form Validator
======================================

A collection of directives that simplify the form validation with the Angular Material Design

[Demo](http://codepen.io/caferrari/pen/zrQBvY?editors=1010)

How to install
--------------

`bower install --save md-form-validator`

Config Default Messages
-----------------------

```javascript
angular.module("myApp").config(function(mdFormValidatorProvider) {
    mdFormValidatorProvider.setMessage("required", "This field is required");
    mdFormValidatorProvider.setMessage("maxlength", "Please enter no more than {maxlength} characters");
}]);
```
