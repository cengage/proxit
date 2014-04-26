Proxit [![Build Status](https://travis-ci.org/cengage/proxit.svg?branch=master)](https://travis-ci.org/cengage/proxit)
======

Simple proxy server built on connect.

## Installation

1. npm install -g proxit (may need to add "sudo" for Mac / Linux)

## Configuration - Stand Alone

1. Create a configuration file in one of the following locations:
  * a local `.proxitrc` or the first found looking in `./ ../ ../../ ../../../` etc.
  * `$HOME/.proxitrc`
  * `$HOME/.proxit/config`
  * `$HOME/.config/proxit`
  * `$HOME/.config/proxit/config`
  * `/etc/proxitrc`
  * `/etc/proxit/config`

2. Update the configuration file, e.g.:

```json
{
    "port": 9000,
    "verbose": true,
    "routes": {
        "/": "http://nodejs.org/",
        "/someroute": "/somelocaldirectory/"
    }
}
```

3. Start proxit by running `proxit` on the command line.

## Configuration - Grunt

In your project's `gruntfile.js`, add a section named `proxit`.

```js
grunt.initConfig({
    proxit: {
        dev: {
            options: {
                verbose: true,
                routes: {
                    '/': 'http://nodejs.org/'
                }
            }
        }
    }
});

grunt.loadNpmTasks('proxit');

```

You can now start your dev configuration using `grunt proxit:dev`.

## Configuration - Middleware

```js

var proxit = require('proxit');

var config = {
   verbose: true,
   routes: {
       '/': 'http://nodejs.org/'
   }
};

express.use(proxit(config));

```

## Issues / Bugs

https://github.com/cengage/proxit/issues

