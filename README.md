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

**With default messages you don´t need to add a md-message() for each validation:**

Before:
```html
<md-input-container>
  <label>Code</label>
  <input ng-model="code" name="code" required/>
  <md-messages>
    <md-message required>Required</md-message>
  </md-messages>
</md-input-container>
```
After default messages:
```html
<md-input-container>
  <label>Code</label>
  <input ng-model="code" name="code" required/>
  <md-messages />
</md-input-container>
```
To override the message:
```html
<md-input-container>
  <label>Code</label>
  <input ng-model="code" name="code" required/>
  <md-messages>
    <md-message required>
      This is my cool required message for this field
    </md-message>
  </md-messages>
</md-input-container>
```
