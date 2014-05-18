module.exports = {
    type: 'object',
    patternProperties: {
        '^.*$': {
            type: 'string'
        }
    },
    additionalProperties: false,
    minProperties: 1
};
