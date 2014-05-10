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
                '[.]*': {
                    type: 'string'
                }
            },
            additionalProperties: false,
            minProperties: 1
        }
    },
    additionalProperties: false
};
