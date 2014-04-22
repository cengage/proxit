var URL = require('url');

module.exports = {
    convert: function(route, from, to) {
        from = URL.parse(from);

        if (from.pathname.indexOf(route) === 0) {
            var script = from.pathname.substring(route.length);

            to = to.pathname ? to : URL.parse(to);
            to.search = from.search;
            to.auth = from.auth;
            to.hash = from.hash;
            to.path = join(to.pathname, script) + searchString(to);
            to.href = to.protocol + '//' + authString(to) + to.host + to.path + hashString(to);

            return to;
        }
    }
};

function authString(url) {
    return url.auth ? url.auth + '@' : '';
}

function searchString(url) {
    return url.search ? url.search : '';
}

function hashString(url) {
    return url.hash ? url.hash : '';
}

function join(part1, part2) {
    part1 = part1 || '';
    if (part1 && part1[part1.length - 1] === '/') {
        part1 = part1.substring(0, part1.length - 1);
    }
    part2 = part2 || '';
    if (part2 && part2.length > 0 && part2[0] !== '/') {
        part2 = '/' + part2;
    }
    var result = part1 + part2;
    if (result.length === 0) {
        result = '/';
    }
    return result;
}
