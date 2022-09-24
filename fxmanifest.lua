fx_version 'cerulean'

game 'gta5'

name 'DiscordFramework'
description 'A custom framework based on the Discord for permissions'
author 'ItsAmmarB#7897'
version 'v4.0-indev'
url 'https://github.com/ItsAmmarB/DiscordFramework/'

debug_mode 'true'

dependency 'yarn'

server_script {

    -- CORE
    'CFX/server.js',
   
    -- EXTENSIONS
    'extensions/**/sv_*.js',

    -- -- UTILS
    -- 'utils/**/sv_**.js'

}

client_script {

    -- CORE
    'CFX/client.js',

    -- EXTENSIONS
    'extensions/**/cl_*.js',

    -- -- UTILS
    -- 'utils/**/cl_**.js'
}


shared_script {

    -- -- EXTENSIONS
    'extensions/**/sh_*.js',
   
    -- -- COMMANDS
    -- 'commands/**/sh_**.js',

    -- -- UTILS
    -- 'utils/**/sh_**.js'
   
}

print('test')