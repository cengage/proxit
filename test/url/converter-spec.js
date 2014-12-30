var convertObj = require('../../lib/url/converter'),
    convert = convertObj.convert,
    expect = require('chai').expect,
    URL = require('url'),
    _ = require('lodash');

describe('converter', function() {
    describe('with "to" as string', function() {
        tests('http://www.nodejs.org');
    });

    describe('with "to" as URL object', function() {
        tests(URL.parse('http://www.nodejs.org'));
    });

    it('should convert a single file with query params', function() {
        expectUrl(convert('/idea.html', 'http://localhost/idea.html?test=true', 'http://www.nodejs.org/test.html'), {
            hostname: 'www.nodejs.org',
            path: '/test.html?test=true',
            href: 'http://www.nodejs.org/test.html?test=true'
        });
    });

    describe('syncSearchOnUrlObject', function() {
        it('should sync path and href to the new search parameter', function() {
            var urlObj = URL.parse('http://www.nodejs.org');
            urlObj.search = '?node=fun';

            convertObj.syncSearchOnUrlObject(urlObj);

            expect(urlObj.path).to.eql('/?node=fun');
            expect(urlObj.href).to.eql('http://www.nodejs.org/?node=fun');
        });

        it('should safely sync when url object had previous query', function() {
            var urlObj = URL.parse('http://www.nodejs.org?one=one');
            urlObj.search = '?one=one&two=two';

            convertObj.syncSearchOnUrlObject(urlObj);

            expect(urlObj.path).to.eql('/?one=one&two=two');
            expect(urlObj.href).to.eql('http://www.nodejs.org/?one=one&two=two');
        });

        it('should keep any pathing in the url', function() {
            var urlObj = URL.parse('http://www.nodejs.org/childpage');
            urlObj.search = '?node=fun';

            convertObj.syncSearchOnUrlObject(urlObj);

            expect(urlObj.path).to.eql('/childpage?node=fun');
            expect(urlObj.href).to.eql('http://www.nodejs.org/childpage?node=fun');
        });
    });

});

function tests(to) {
    it('should convert a simple path', function() {
        expectUrl(convert('/', 'http://localhost/', to), {
            hostname: 'www.nodejs.org',
            path: '/',
            href: 'http://www.nodejs.org/'
        });
    });

    it('should handle files under a directory', function() {
        expectUrl(convert('/idea', 'http://localhost/idea/a.html', to), {
            hostname: 'www.nodejs.org',
            path: '/a.html',
            href: 'http://www.nodejs.org/a.html'
        });
    });

    it('should handle files and query params under a directory', function() {
        expectUrl(convert('/idea', 'http://localhost/idea/a.html?test=true', to), {
            hostname: 'www.nodejs.org',
            path: '/a.html?test=true',
            href: 'http://www.nodejs.org/a.html?test=true'
        });
    });

    it('should handle files and query params under a directory', function() {
        expectUrl(convert('/idea', 'http://localhost/idea/a.html?test=true', to), {
            hostname: 'www.nodejs.org',
            path: '/a.html?test=true',
            href: 'http://www.nodejs.org/a.html?test=true'
        });
    });

    it('should handle auth and hash values', function() {
        expectUrl(convert('/idea', 'http://testdude:password@localhost/idea/a.html?test=true#coolness', to), {
            hostname: 'www.nodejs.org',
            path: '/a.html?test=true',
            href: 'http://testdude:password@www.nodejs.org/a.html?test=true#coolness'
        });
    });

    it('should return undefined if the route doesn\'t match', function() {
        expect(convert('/idea', 'http://localhost/test', to)).to.eql(undefined);
    });
}

function expectUrl(url, template) {
    expect(_.pick(url, Object.keys(template))).to.eql(template);
}
