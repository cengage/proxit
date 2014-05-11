module.exports = {
    properties: {
        hostnames: {
            type: 'array',
            items: {
                type: 'string'
            }
        },
        routes: {
            $ref: '/routes'
        }
    },
    additionalProperties: false,
    required: ['routes']
};
