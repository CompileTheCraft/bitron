import { Message, MessageEmbed } from "discord.js";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";

import { Events } from "../../types";

class TestCommand extends Command {
  constructor() {
    super({
      name: "test",
      description: "testing purposes",
      expectedArgs: {
        args: null,
        minArgs: 0,
        maxArgs: 0,
      },
      category: "Development",
      aliases: [],
      userPermissions: [],

      cooldown: 10,
      ownerOnly: true,
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
      message.channel.send(client.devChannel.name);
    } catch (error) {
      client.emit(Events.COMMAND_ERROR, error, this, message, client);
    }
  }
}

export default TestCommand;
