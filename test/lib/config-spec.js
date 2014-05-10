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
        options;

    beforeEach(function() {
        mockery.setup({
            allow: [sut, 'lodash', 'path', 'minimist'],
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

        };

        exists = false;
    });

    it('should return proxit.json present and nothing is passed', function() {
        givenProxitJson();
        whenConfigCalledWithNoOptions();
        thenConfigShouldEqualProxitJson();
    });

    it('should return options passed when present', function() {
        givenProxitJson();
        whenConfigCalledWithOptions();
        thenConfigShouldEqualOptions();
    });

    afterEach(function() {
        mockery.teardown();
    });

    function givenProxitJson() {
        mockery.registerMock(process.cwd() + path.sep + 'proxit.json', _.cloneDeep(proxitJson));
        exists = true;
    }

    function whenConfigCalledWithNoOptions() {
        config = require(sut);
        result = _.omit(config());
    }

    function whenConfigCalledWithOptions() {
        config = require(sut);
        result = _.omit(config(options));
    }

    function thenConfigShouldEqualProxitJson() {
        expect(result).to.eql(proxitJson);
    }

    function thenConfigShouldEqualOptions() {
        expect(result).to.eql(options);
    }
});