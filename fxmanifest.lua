fx_version 'bodacious'

games {'gta5'}

dependency 'yarn'

client_scripts {
    -- Permissions
    'Permissions/client.js',
    -- Blacklists
    'Blacklists/client.js',
    -- Queue
    'Queue/client.js',
    -- PrivateChat
    'PrivateChat/client.js',
    -- Discord RPC
    'RPC/client.js',
    -- Logs
    'Logs/client.js',
    -- Watchlist
    'Watchlist/client.js',
    -- DeathManager
    'DeathManager/client.js',
    -- Chat
    'Chat/client.js',

    -- Commands | Administration
    'Commands/Administration/client.js',
    -- Commands | Public
    'Commands/Public/client.js',
}

server_scripts {
    --Initilizer
    'index.js',
    -- Permissions
    'Permissions/server.js',
    -- Blacklists
    'Blacklists/server.js',
    -- Queue
    'Queue/server.js',
    -- PrivateChat
    'PrivateChat/server.js',
    -- Discord RPC
    'RPC/server.js',
    -- Logs
    'Logs/server.js',
    -- Watchlist
    'Watchlist/server.js',
    -- DeathManager
    'DeathManager/server.js',
    -- Chat
    'Chat/server.js',
    -- Screenshot
    'Screenshot/server.js',
    -- AutoMessage
    'AutoMessage/index.js',

    -- Commands | Administration
    'Commands/Administration/server.js',
    -- Commands | Public
    'Commands/Public/server.js',
}

exports {
    'CheckPermission',
    'CheckRoles',
    'GetRoles',
    'GetRoleName',
    'GetScreenshot',
    'IsUserInDiscord',
    'GetDiscordID'
}