var config = require('./config'),
    options = require('./options');

require('colors');

var green = function(string) {
  if (options['no-color']) {
    return string;
  }
  else {
    return ('' + string).green;
  }
};

var yellow = function(string) {
  if (options['no-color']) {
    return string;
  }
  else {
    return ('' + string).yellow;
  }
};

var red = function(string) {
  if (options['no-color']) {
    return string;
  }
  else {
    return ('' + string).red;
  }
};

var standard = {
  error: function() {
    var message = Array.prototype.join.call(arguments, ' ');
    console.log(red(message));
  },

  http: function(statusCode) {
    statusCode = '' + statusCode;
    var message = Array.prototype.join.call(Array.prototype.slice.call(arguments, 1), ' ');
    switch (statusCode.charAt(0)) {
      case '2':
        console.log(green(statusCode) + ' ' + message);
        break;
      case '3':
        console.log(yellow(statusCode) + ' ' + message);
        break;
      case '4':
      case '5':
        console.log(red(statusCode) + ' ' + message);
        break;
      default:
        console.log(statusCode + ' ' + message);
        break;
    }
  },

  plain: function() {
    var message = Array.prototype.join.call(arguments, ' ');
    console.log(message);
  },

  green: function() {
    var message = Array.prototype.join.call(arguments, ' ');
    console.log(green(message));
  }
};

var verbose = {};
var keys = Object.keys(standard).forEach(function(key) {
  if (typeof standard[key] === 'function') {
    verbose[key] = function() {
      if (config.verbose) {
        standard[key].apply(this, arguments);
      }
    };
  }
});

standard.verbose = verbose;

module.exports = standard;
