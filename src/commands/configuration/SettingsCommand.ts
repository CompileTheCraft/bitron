import { Message, MessageEmbed } from "discord.js";
import EmbedProvider from "../../providers/EmbedProvider";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";

class SettingsCommand extends Command {
  constructor() {
    super({
      name: "settings",
      description: "settings for your guild",
      expectedArgs: {
        args: null,
        minArgs: 0,
        maxArgs: 2,
      },
      category: "Configuration",
      cooldown: 10,
      aliases: ["config", "configuration"],
      userPermissions: ["ADMINISTRATOR"],
      ownerOnly: false,
      disabled: false,
    });
  }

  async run(
    client: ExtendedClient,
    message: Message<boolean>,
    args: string[],
    cmd: string
  ) {
    let guildProfile = await client.dataClient.getGuildById(message.guild?.id!);

    if (!guildProfile)
      return message.reply({
        embeds: [
          EmbedProvider.onConditionFalse(
            `Please register your guild\n\`${client.config.prefix}setup\``
          ),
        ],
      });

    if (!args.length) {
      let embed = new MessageEmbed({
        title: `${message.guild?.name}'s Settings`,
        description:
          "If you see no settings below, you have not updated your properties",
        fields: [
          { name: "Prefix", value: guildProfile.prefix },
          {
            name: "Robbing",
            value: guildProfile.robbing ? "enabled" : "disabled",
          },
          {
            name: "Logging",
            value: guildProfile.logging ? "enabled" : "disabled",
          },
          {
            name: "Logging Channel's ID",
            value: guildProfile.loggingChannelID!,
          },
        ],
      });

      message.channel.send({ embeds: [embed] });
    } else {
      if (!["prefix", "logging", "loggingChannelID"].includes(args[0]))
        return message.reply({
          embeds: [
            EmbedProvider.onConditionFalse("Please enter a valid setting"),
          ],
        });

      if (!args[1])
        return message.reply("You did not set a value to the setting");

      if ("prefix" === args[0]) {
        if (args[1].length > 5)
          return message.reply({
            embeds: [
              EmbedProvider.onConditionFalse(
                "The prefix must be below 5 characters or equal to 5 characters"
              ),
            ],
          });

        await client.dataClient.updateGuild({
          id: message.guild?.id!,
          prefix: args[1],
        });
      } else if ("robbing" === args[0]) {
        if (!["enable", "disable"].includes(args[1]))
          return message.reply({
            embeds: [
              EmbedProvider.onConditionFalse(
                "Please enter the setting properly"
              ),
            ],
          });

        await client.dataClient.updateGuild({
          id: message.guild?.id!,
          robbing: args[1] === "enable" ? true : false,
        });
      } else if ("logging" === args[0]) {
        if (!["enable", "disable"].includes(args[1]))
          return message.reply({
            embeds: [
              EmbedProvider.onConditionFalse(
                "Please enter the setting properly"
              ),
            ],
          });

        await client.dataClient.updateGuild({
          id: message.guild?.id!,
          logging: args[1] === "enable" ? true : false,
        });
      } else if ("loggingChannelID" === args[0]) {
        if (!message.guild?.channels.cache.get(args[1]))
          return message.reply({
            embeds: [
              EmbedProvider.onConditionFalse(
                "There seems to be no channel in the server with the specified ID"
              ),
            ],
          });

        await client.dataClient.updateGuild({
          id: message.guild?.id!,
          loggingChannelID: args[1],
        });
      }
    }
  }
}

export default SettingsCommand;
