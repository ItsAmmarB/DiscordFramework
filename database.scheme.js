Players = [
    {
        id: 'MONGO OBJECT(ID_)',
        details: {
            discordId: 'DISCORD ID',
            serverId: 'CURRENT SERVER ID / LAST KNOWN SERVER ID',
            playtime: 'SOME NUMBER',
            lastSeenTimestmap: 'SOME TIMESTAMP',
            identifiers: 'IDENTIFIERS',
            names: [],
            locale: 'LOCALE'
        },
        infractions: [
            {
                id: 'MONGO OBJECT(ID_)',
                type: 'BAN/MUTE/KICK/WARN/ADMIN_JAIL',
                moderator: {
                    server: {
                        id: 'SERVER ID',
                        name: 'SERVER NAME'
                    },
                    discord: {
                        id: 'DISCORD ID',
                        name: 'DISCORD NAME'
                    }
                },
                details: {
                    timestamp: 'SOME TIMESTAMP',
                    duration: 'SOME DURATION',
                    reason: 'SOME REASON'
                }
            }
        ],
        administration: {
            banned: 'MONGO OBJECT(ID_) OF THE INFRACTION OBJECT',
            muted: false,
            jailed: false
        }
    }
];
