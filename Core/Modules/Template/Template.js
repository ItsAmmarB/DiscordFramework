const { Module: Modules } = require('../../modules');

module.exports.Module = class Test extends Modules {
    constructor(modules) {
        super(modules, {
            name: 'Test',
            description: 'A testing module',
            toggle: true,
            version: '1.0',
            author: 'ItsAmmarB',
            config: {
                working: true
            }
        });

        this.Ready();
    }
};