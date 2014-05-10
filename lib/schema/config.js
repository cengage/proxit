module.exports = {
    properties: {
        port: {
            type: 'number'
        },
        verbose: {
            type: 'boolean'
        },
        routes: {
            type: 'object',
            patternProperties: {
                '^.*$': {
                    type: 'string'
                }
            },
            additionalProperties: false,
            minProperties: 1
        },
        plugins: {
            type: 'object',
            patternProperties: {
                '^[a-z][a-z0-9-_]*$': {
                    type: 'string',
                    format: 'semver-range'
                }
            },
            additionalProperties: false
        }
    },
    additionalProperties: false
};
