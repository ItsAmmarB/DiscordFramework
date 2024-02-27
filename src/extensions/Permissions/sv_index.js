const { Extension } = require("../../core/index").Extensions;

const Config = require("./config");

const Permissions = new Extension({
  name: "Permissions",
  description: "Discord role based permissions system",
  toggle: true,
  version: "1.0",
  author: "ItsAmmarB",
  config: Config,
});

/**
 * This is how you set the main extension function to be executed whenever the framework core ready event is triggered
 * @param ExtensionInfo - The current extension's provided information on creation such as name, description, toggle, version, author, config and other hidden variables
 * @param Discord - Discord module exports including the Discord client
 * @param MongoDB - MongoDB module exports including the MongoDB client
 * @param Utilities - Some useful functions and networked variables such as Player Class, Players Class, Network Players & their information, Connections, onConnection() (for when a player is connecting) and etc..
 */
Permissions.setFunction((ExtensionInfo, { Discord, MongoDB, Utilities }) => {
  Utilities.Players.Conenctions.onJoined((player) => {
    if (player.getDiscordId()) {
      AceAdd(player);
      return Permissions.runClient(player.getServerId(), {
        player: player,
        config: Config,
      });
    }
  });

  Utilities.Players.Conenctions.onDisconnected((player) => {
    if (player.getDiscordId()) {
      return AceRemove(player);
    }
  });

  on("DiscordFrameworK:Player:Roles:Updated", (player) => {
    emitNet(
      "DiscordFrameworK:Extension:Permission:UpdateRole",
      player.server.id,
      player
    );
  });

  /**
   * Checks a player's permission by matching their ID, Roles, and administrative status against the provided roles
   * @param {string|number} PlayerId A player identifiable variable; like server id, player identifiers (discord, game license, fivem:id, and etc..)
   * @param {string[]} Roles An array of string containing roles' ids
   * @param {string} GuildId Targeted guild id to check within
   * @returns {boolean} Whether the player has permission or not
   */
  const CheckPermission = (PlayerId, Roles, GuildId) => {
    if (!PlayerId) return false; // Check whether a PlayerId was provided
    if (!Utilities.Players.NetworkPlayers.validateIdentifier(PlayerId))
      return false; // Check whether the provided PlayerId is any kind of an identification method
    if (Config.allowEveryone || parseFloat(PlayerId) === 0) return true; // if "allowEveryone" or playerId is 0 (Server terminal) then save the time and just return true; otherwise keep going... :P
    const Player = new Utilities.Players.Player(PlayerId); // Create a player class

    if (!Player.getDiscordId()) return false; // Check whether the player has Discord connected

    if (!Roles) return false; // Check whether Roles were provided
    if (!Array.isArray(Roles)) return false; // Check whether the provided Role is an Array

    if (Config.communityGuild.only) GuildId = Config.communityGuild.id; // Check if communityGuild.only is active, then set communityGuild as targeted guild

    if (Config.selfPermission) {
      // Check whether Permission.selfPermission is enabled or not
      if (Roles.includes(Player.getDiscordId())) return true; // if Permission.selfPermission is enabled and the player's Discord ID is included in the Role, then return true
    }

    const Guilds = GuildId
      ? [Player.discord.guilds.find((guild) => guild.id === GuildId)]
      : Player.discord.guilds; // Makes the guild/guilds into an altered array for a unified logic

    if (Config.discordAdmin) {
      // Check whether Permission.discordAdmin is enabled or not
      if (Guilds.find((guild) => guild.administrator)) return true; // Check if the player is an administrator in any of the guild in the Guilds array
    }

    if (
      Roles.find((roleA) =>
        Guilds.find((guild) => guild.roles.find((roleB) => roleA === roleB.id))
      )
    )
      return true; // Check if the player has any role of the provided role within the guilds in the Guilds array

    return false; // if the player doesn't have admin or match any of the roles, then return false
  };

  const AceAdd = (Player) => {
    if (!Config.acePermissions.enabled) return;
    for (const Permission of Config.acePermissions.permissions) {
      if (!Permission.enabled) return;
      if (!CheckPermission(Player.getDiscordId(), Permission.roles)) return;
      if (Permission.groups.length > 0) {
        for (const Group of Permission.groups) {
          ExecuteCommand(
            `add_principal identifier.discord:${Player.getDiscordId()} ${Group}`
          );
        }
      }
      if (Permission.aces.length > 0) {
        for (const Ace of Permission.aces) {
          ExecuteCommand(
            `add_ace identifier.discord:${Player.getDiscordId()} ${Ace} allow`
          );
        }
      }
    }
  };

  const AceRemove = (Player) => {
    if (!Config.acePermissions.enabled) return;
    for (const Permission of Config.acePermissions.permissions) {
      if (!Permission.enabled) return;
      if (!CheckPermission(Player.getDiscordId(), Permission.roles)) return;
      if (Permission.groups.length > 0) {
        for (const Group of Permission.groups) {
          ExecuteCommand(
            `remove_principal identifier.discord:${Player.getDiscordId()} ${Group}`
          );
        }
      }
      if (Permission.aces.length > 0) {
        for (const Ace of Permission.aces) {
          ExecuteCommand(
            `remove_ace identifier.discord:${Player.getDiscordId()} ${Ace}`
          );
        }
      }
    }
  };

  RegisterCommand("cp", (source, args) => {
    console.log(CheckPermission(args[0], [args[1]], args[2]));
  });

  Permissions.setCFXExports({
    CheckPermission: (PlayerId, Roles, GuildId) =>
      CheckPermission(PlayerId, Roles, GuildId),
  });

  module.export = {
    CheckPermission,
  };
});
