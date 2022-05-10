import { Message } from "discord.js";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";
import { Events } from "../../types";

class AvatarCommand extends Command {
  constructor() {
    super({
      name: "avatar",
      description: "shows your avatar or the mentioned person's avatar",
      expectedArgs: {
        args: "<@user>",
        minArgs: 0,
        maxArgs: 1,
      },
      category: "Utility",
      aliases: [],
      userPermissions: [],

      cooldown: 10,
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
      const mentionedMember = message.mentions.members?.first();

      if (mentionedMember) {
        message.channel.send(
          mentionedMember.displayAvatarURL({ dynamic: true })
        );
      } else {
        message.channel.send(
          message.author.displayAvatarURL({ dynamic: true })
        );
      }
    } catch (error) {
      client.emit(Events.COMMAND_ERROR, error, this, message, client);
    }
  }
}

export default AvatarCommand;
