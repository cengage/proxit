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
        port: {
            type: 'number'
        },
        routes: {
            $ref: '/routes'
        },
        verbose: {
            type: 'boolean'
        },
        maxSockets: {
            type: 'number'
        }
    },
    additionalProperties: false
};
