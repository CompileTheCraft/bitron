import { Message } from "discord.js";
import EmbedProvider from "../../providers/EmbedProvider";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";
import { Events } from "../../types";

class SetupCommand extends Command {
  constructor() {
    super({
      name: "setup",
      description: "setups the configuration for the guild",
      expectedArgs: {
        args: null,
        minArgs: 0,
        maxArgs: 0,
      },
      category: "Configuration",
      cooldown: 10,
      aliases: [],
      userPermissions: ["ADMINISTRATOR"],
      ownerOnly: false,
      disabled: false,
    });
  }

  async run(
    client: ExtendedClient,
    message: Message,
    args: string[],
    cmd: string
  ) {
    try {
      let guildProfile = await client.dataClient.getGuildById(
        message.guild?.id!
      );

      if (guildProfile)
        return message.reply({
          embeds: [
            EmbedProvider.onConditionFalse(
              "Your guild has been registered already!"
            ),
          ],
        });

      guildProfile = await client.dataClient.setupGuild(
        message.guild?.id!,
        message.guild?.name!
      );

      message.channel.send({
        embeds: [
          EmbedProvider.onSuccess(
            `**Successfully registered your server!**\nRun \`${client.config.prefix}settings\` to update your guild settings!`
          ),
        ],
      });
    } catch (error) {
      client.emit(Events.COMMAND_ERROR, error, this, message, client);
    }
  }
}

export default SetupCommand;
