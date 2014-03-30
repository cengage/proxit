var chalk = require('chalk'),
    config = require('./config');

chalk.enabled = true;

var green = function(string) {
  if (config['no-color']) {
    return string;
  }
  else {
    return chalk.green('' + string);
  }
};

var yellow = function(string) {
  if (config['no-color']) {
    return string;
  }
  else {
    return chalk.yellow('' + string);
  }
};

var red = function(string) {
  if (config['no-color']) {
    return string;
  }
  else {
    return chalk.red('' + string);
  }
};

var standard = {
  error: function() {
    var message = Array.prototype.join.call(arguments, ' ');
    console.log(red(message));
  },

  http: function(req, res) {
    var statusCode = '' + res.statusCode,
        method = req.method,
        message = method + ' ';
    switch (statusCode.charAt(0)) {
      case '2':
        message += green(statusCode);
        break;
      case '3':
        message += yellow(statusCode);
        break;
      default:
        message += red(statusCode);
        break;
    }
    console.log(message + ' ' + Array.prototype.join.call(Array.prototype.slice.call(arguments, 2), ' '));
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
