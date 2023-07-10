const { Extension } = require('../../core/lib/extensions/index');

const Permission = new Extension({
    name: 'Permissions',
    description: 'An extension that uses discord roles as permissions',
    toggle: true,
    version: '0.0.1',
    author: 'ItsAmmarB',
    config: {}
});

Permission.setFunction((ExtensionInfo, { Discord, MongoDB, Utilities }) => {
    // Place holder
});

Permission.setCFXExports({
    CheckPermission: (name) => {
        return `${name} does not have permission!`;
    }
});