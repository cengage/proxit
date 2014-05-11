module.exports = {
    properties: {
        hosts: {
            type: 'array',
            items: {
                $ref: '/host'
            }
        },
        hostnames: {
            type: 'array',
            items: {
                type: 'string'
            }
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
        },
        port: {
            type: 'number'
        },
        routes: {
            $ref: '/routes'
        },
        verbose: {
            type: 'boolean'
        }
    },
    additionalProperties: false
};
