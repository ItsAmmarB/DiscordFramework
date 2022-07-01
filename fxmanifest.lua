fx_version 'cerulean'

game 'gta5'

name 'DiscordFramework'
description 'A custom framework based on the Discord for permissions'
author 'ItsAmmarB#7897'
version 'v4.0-indev'
url 'https://github.com/ItsAmmarB/DiscordFramework/'

dependency 'yarn'

server_script {

    -- CORE
    'core/configs/sv_**.js',
    'core/sv_**.js',

    
    -- Configurations
    'configurations/sv_config.js',

    -- MODULES
    'modules/**/sv_**.js',

    -- EXTENSIONS
    'extensions/**/sv_**.js',

    -- COMMANDS
    'commands/**/sv_**.js',

    -- UTILS
    'utils/**/sv_**.js'

}

client_script {

    -- CORE
    'core/configs/cl_**.js',
    'core/cl_**.js',

    
    -- Configurations
    'configurations/sv_config.js',

    -- MODULES
    'modules/**/cl_**.js',

    -- EXTENSIONS
    'extensions/**/cl_**.js',

    -- COMMANDS
    'commands/**/cl_**.js',
 
    -- UTILS
    'utils/**/cl_**.js'
}

shared_script {

    -- CORE
    'core/configs/sh_**.js',
    'core/sh_**.js',


    -- MODULES
    'modules/**/sh_**.js',

    -- Functions
    'modules/functions.js',

    -- EXTENSIONS
    'extensions/**/sh_**.js',
   
    -- COMMANDS
    'commands/**/sh_**.js',

    -- UTILS
    'utils/**/sh_**.js'
   
}