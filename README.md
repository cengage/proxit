Proxit [![Build Status](https://travis-ci.org/cengage/proxit.svg?branch=master)](https://travis-ci.org/cengage/proxit)
======

Simple proxy server built on connect.

## Installation

1. sudo npm install -g proxit

## Configuration

1. Create a ".proxitrc" file in one of the following locations:
  * a local `.proxitrc` or the first found looking in `./ ../ ../../ ../../../` etc.
  * `$HOME/.proxitrc`
  * `$HOME/.proxit/config`
  * `$HOME/.config/proxit`
  * `$HOME/.config/proxit/config`
  * `/etc/proxitrc`
  * `/etc/proxit/config`

2. Save configuration to ".proxitrc", e.g.:

```json
{
    "port": 9000,
    "verbose": true,
    "routes": {
        "/": "http://nodejs.org/"
    }
}
```

3. Start proxit by running "proxit" on the command line.


## Issues / Bugs

https://github.com/cengage/proxit/issues

