module.exports = {
    properties: {
        port: {
            type: 'number'
        },
        verbose: {
            type: 'boolean'
        },
        routes: {
            $ref: '/routes'
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
