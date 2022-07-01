fx_version 'cerulean'

game 'gta5'

name 'DiscordFramework'
description 'A custom framework based on the Discord for permissions'
author 'ItsAmmarB#7897'
version 'v4.0-indev'
url 'https://github.com/ItsAmmarB/DiscordFramework/'

dependency 'yarn'

debug_mode 'false' 

client_script {
    
    -- Configurations
    'configurations/cl_config.js',

    -- Modules
    'modules/**/cl_**.js',

    -- Extensions
    'extensions/**/cl_**.js',

    -- Commands
    'commands/**/cl_**.js'

}

server_script {

    -- Configurations
    'configurations/sv_config.js',

    -- Modules
    'modules/**/sv_**.js',

    -- Extensions
    'extensions/**/sv_**.js',

    -- Commands
    'commands/**/sv_**.js'

}

shared_script {

    -- Configurations
    'configurations/sh_config.js',

    -- Modules
    'modules/**/sh_**.js',

    -- Functions
    'modules/functions.js',

    -- Extensions
    'extensions/**/sh_**.js',
   
    -- Commands
    'commands/**/sh_**.js'
   

}