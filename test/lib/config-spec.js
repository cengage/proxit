var chai = require('chai'),
    spies = require('chai-spies'),
    expect = chai.expect,
    mockery = require('../mockery'),
    fs = require('fs'),
    rc = require('rc'),
    path = require('path'),
    sut = '../../lib/config',
    _ = require('lodash'),
    proxitJson = JSON.parse(fs.readFileSync('.proxitrc'));

chai.use(spies);

describe('config', function() {
    var config,
        exists,
        result,
        options,
        exception;

    beforeEach(function() {
        mockery.setup({
            allow: [sut, 'lodash', 'path', 'minimist', 'tv4', './schema/config'],
            mock: {
                'fs': {
                    existsSync: function() {
                        return exists;
                    }
                },
                'rc': chai.spy(rc)
            }
        });

        options = {
            port: 8080,
            verbose: true,
            routes: {
                '/': '/mysite'
            }
        };

        exists = false;
        exception = undefined;
        result = undefined;
    });

    it('should return proxit.json when present and nothing is passed', function() {
        givenProxitJson();
        whenConfigCalledWithNoOptions();
        thenConfigShouldEqualProxitJson();
    });

    it('should return options passed when present', function() {
        givenProxitJson();
        whenConfigCalledWithOptions();
        thenConfigShouldEqualOptions();
    });

    it('should throw exception on invalid options', function() {
        givenInvalidOptions();
        whenConfigCalledWithOptions();
        thenInvalidOptionsExceptionShouldBeThrown();
    });

    afterEach(function() {
        mockery.teardown();
    });

    function givenProxitJson() {
        mockery.registerMock(process.cwd() + path.sep + 'proxit.json', _.cloneDeep(proxitJson));
        exists = true;
    }

    function givenInvalidOptions() {
        options.trash = true;
    }

    function whenConfigCalledWithNoOptions() {
        config = require(sut);
        try {
            result = _.omit(config());
        } catch (e) {
            exception = e;
        }
    }

    function whenConfigCalledWithOptions() {
        config = require(sut);
        try {
            result = _.omit(config(options));
        } catch (e) {
            exception = e;
        }
    }

    function thenConfigShouldEqualProxitJson() {
        expect(result).to.eql(proxitJson);
    }

    function thenConfigShouldEqualOptions() {
        expect(result).to.eql(options);
    }

    function thenInvalidOptionsExceptionShouldBeThrown() {
        expect(exception).to.equal('Configuration is invalid.');
    }
});
