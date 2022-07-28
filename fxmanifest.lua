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
    'core/sv_index.js',
   
    -- EXTENSIONS
    -- 'extensions/**/sv_**.js',



    -- -- UTILS
    -- 'utils/**/sv_**.js'

}

client_script {

    -- CORE
    'core/cl_index.js',

    -- EXTENSIONS
    -- 'extensions/**/cl_**.js',

    -- -- UTILS
    -- 'utils/**/cl_**.js'
}


shared_script {

    -- CORE
    -- 'core/configs/sh_**.js',
    -- 'core/sh_core.js',

    -- -- MODULES
    -- 'modules/**/sh_**.js',

    -- -- Functions
    -- 'modules/functions.js',

    -- -- EXTENSIONS
    -- 'extensions/**/sh_**.js',
   
    -- -- COMMANDS
    -- 'commands/**/sh_**.js',

    -- -- UTILS
    -- 'utils/**/sh_**.js'
   
}

print('test')