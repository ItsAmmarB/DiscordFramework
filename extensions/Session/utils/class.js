const Sessions = new Map();

const Session = class Session {

    constructor(NPCs, Gamemode, Players, IsFreeroam = false) {
        let mapKey = null
        if (IsFreeroam) {
            this.BucketID = 0;
            mapKey = 'Freeroam'
        } else {
            let IsPushed = false;
            for (let i = 1; i < 64; i++) {
                const Session = Sessions.get(i);
                if (!Session) {
                    IsPushed = true;
                    this.BucketID = i;
                    mapKey = i
                    break;
                }
            }

            if (!IsPushed) return console.warn('[DiscordFramework:Extensions:Session]: Max Bucket ID was reached!');
        }

        this.NPCs = NPCs || false;
        this.Gamemode = Gamemode || 'Unknown';
        // this.Players = new Map(Players ? Players.map(p => ([p, GetPlayerName(p)])) : []);
        this.Players = new Map(Players);

        Sessions.set(mapKey, {
            BucketID: this.BucketID,
            NPCs: this.NPCs,
            Gamemode: this.Gamemode,
            Players: this.Players
        });

        SetRoutingBucketPopulationEnabled(this.BucketID, NPCs)

        this.#DeclareEvents(IsFreeroam)
        this.#WarpPlayers()

        emit('DiscordFramework:Session:Created', { BucketID: this.BucketID, NPCs: this.NPCs, Gamemode: this.Gamemode, Players: this.Players });

    }

    // SETTERS & GETTERS

    /**
     * @description Gets the Session's bucket idea.
     * @return number
     */
    get GetBucketID() {
        return this.BucketID;
    }

    /**
     * @description Gets the Session's NPC setting.
     * @return boolean
     */
    get GetNPCs() {
        return this.NPCs;
    }

    /**
     * @description Sets the Session's NPC setting.
     * @param {boolean} Mode True to enable NPCs, false to disable NPCs
     * @return boolean
     */
    set SetNPCs(Mode) {
        const type = typeof Mode;
        if (type !== 'boolean') return;

        this.NPCs = Mode;

        SetRoutingBucketPopulationEnabled(this.BucketID, Mode);

        emit('DiscordFramework:Session:NPCs:Set', { BucketID: this.BucketID, NPCs: this.NPCs });
    }

    /**
     * @description Gets the Session's Gamemode. (The game name)
     * @return string
     */
    get GetGamemode() {
        return this.Gamemode;
    }

    /**
     * @description Sets the Session's Gamemode setting.
     * @param {string} Gamemode The new Gamemode name; AKA, game name
     * @return boolean
     */
    set SetGamemode(Gamemode) {
        const type = typeof Gamemode;
        if (type !== 'string') return;
        this.Gamemode = Gamemode;
    }

    /**
     * @description Gets the Session's players as an array.
     * @return object
     */
    get GetPlayers() {
        return Array.from(this.Players, ([id, name]) => ({ id, name }));
    }



    /**
     * @description Sends a player to the session.
     * @param {number} PlayerId The id of the player
     */
    WarpPlayer(PlayerId) {
        console.log('WarpPlayer | ' + this.BucketID, PlayerId + ' | ' + GetPlayerPed(PlayerId) + ' | ' + NetworkGetNetworkIdFromEntity(GetPlayerPed(PlayerId)))
        if (this.Players.get(PlayerId)) return new Error('Unknown player');

        SetEntityRoutingBucket(GetPlayerPed(PlayerId), this.BucketID)
        SetPlayerRoutingBucket(PlayerId, this.BucketID);

        const PlayerName = GetPlayerName(PlayerId)

        this.Players.set(PlayerId, PlayerName);
        Sessions.get(this.BucketID === 0 ? 'Freeroam' : this.BucketID).Players.set(PlayerId, PlayerName);
        emit('DiscordFramework:Session:PlayerWrapped', { BucketID: this.BucketID, Player: { ID: PlayerId, Name: this.Players.get(PlayerId) } });
    }

    /**
     * @description Sends a player to freeroam.
     * @param {number} PlayerId The id of the player
     */
    WarpPlayerToFreeroam(PlayerId) {
        if (!this.Players.get(PlayerId)) return new Error('Unknown player');

        SetEntityRoutingBucket(GetPlayerPed(PlayerId), Sessions.get('Freeroam').BucketID)
        SetPlayerRoutingBucket(PlayerId, Sessions.get('Freeroam').BucketID);

        Session.get('Freeroam').Players.set(PlayerID, this.Players.get(PlayerId))

        emit('DiscordFramework:Session:PlayerWarppedToFreeroam', { BucketID: this.BucketID, Player: { ID: PlayerId, Name: this.Players.get(PlayerId) } });
        this.Players.delete(PlayerId);
        Sessions.get(this.BucketID).Players.delete(PlayerId);
    }

    /**
     * @description Dispose the session and warp all players to freeroam.
     */
    Dispose() {
        this.Players.forEach(async (v, k) => {
            await SetEntityRoutingBucket(GetPlayerPed(k), Sessions.get('Freeroam').BucketID)
            await SetPlayerRoutingBucket(k, Sessions.get('Freeroam').BucketID)
            this.Players.delete(k)
            Sessions.get(this.BucketID).Players.delete(k);
        })

        Sessions.delete(this.BucketID);
        emit('DiscordFramework:Session:Disposed', { BucketID: this.BucketID });
    }


    #WarpPlayers() {
        this.Players.forEach(async (v, k) => {
            SetEntityRoutingBucket(GetPlayerPed(k), this.BucketID)
            SetPlayerRoutingBucket(k, this.BucketID);
            emit('DiscordFramework:Session:PlayerWrapped', { BucketID: this.BucketID, Player: { ID: k, Name: v } });
        })
    }

    #DeclareEvents(Freeroam = false) {

        // SETTER EVEMTS

        /**
         * @param {object} Payload information!
         */
        on('DiscordFramework:Session:WarpPlayer', Payload => {
            if (Payload.BucketID !== this.BucketID) return;
            if (this.Players.get(Payload.Player.ID)) return;
            return this.WarpPlayer(Payload.Player.ID)
        })

        /**
         * @param {object} Payload information!
         */
        on('DiscordFramework:Session:WarpPlayerToFreeroam', Payload => {
            if (Payload.BucketID !== this.BucketID) return;
            if (!this.Players.get(PlayerID)) return;
            return this.WarpPlayerToFreeroam(PlayerID)
        })

        // GETTERS EVEMTS

        on('DiscordFramework:Session:PlayerWrapped', Payload => {
            if (Payload.BucketID === this.BucketID) return;
            if (!this.Players.get(Payload.Player.ID)) return;
            this.Players.delete(Payload.Player.ID)
            Sessions.get(this.BucketID === 0 ? 'Freeroam' : this.BucketID).Players.delete(Payload.Player.ID)
        })

        if (Freeroam) {
            on('DiscordFramework:Session:PlayerWarppedToFreeroam', Payload => {
                this.Players.set(Payload.Player.ID, Player.Name)
                Sessions.get('Freeroam').Players.set(Payload.Player.ID, Payload.Player.Name)
            })
        }

    }
};


module.exports = [Session, Sessions]