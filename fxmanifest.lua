fx_version 'bodacious'
game 'gta5'

author 'ItsAmmarB'
version '0.0.3'

debug_mode 'true'

shared_scripts {
    'cfx/shared.js',

    -- Extensions' files
    'src/extensions/**/sh_*.js'
}

client_scripts {
    'cfx/client.js',

    -- Extensions' files
    'src/extensions/**/cl_*.js'
}

server_scripts {
    'cfx/server.js',

    -- Extensions' files
    -- 'src/extensions/**/sv_*.js'  -- This is better loaded from the Extensions module to regulate when the server files start loading
}
