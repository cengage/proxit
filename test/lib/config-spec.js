var chai = require('chai'),
    spies = require('chai-spies'),
    expect = chai.expect,
    mockery = require('../mockery'),
    fs = require('fs'),
    rc = require('rc'),
    path = require('path'),
    sut = '../../lib/config',
    _ = require('lodash'),
    defaultConfig = JSON.parse(fs.readFileSync('.proxitrc'));

chai.use(spies);

describe('config', function() {
    var config,
        exists,
        result;

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

        exists = false;
    });

    it('should return proxit.json present and nothing is passed', function() {
        givenProxitJson();
        whenConfigCalledWithNoParams();
        thenConfigShouldEqualProxitJson();
    });

    afterEach(function() {
        mockery.teardown();
    });

    function givenProxitJson() {
        mockery.registerMock(process.cwd() + path.sep + 'proxit.json', _.cloneDeep(defaultConfig));
        exists = true;
    }

    function whenConfigCalledWithNoParams() {
        config = require(sut);
        result = _.omit(config());
    }

    function thenConfigShouldEqualProxitJson() {
        expect(result).to.eql(defaultConfig);
        mockery.deregisterMock('../../proxit.json');
    }
});
