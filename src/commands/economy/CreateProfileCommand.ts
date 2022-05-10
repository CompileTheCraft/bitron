import { Message } from "discord.js";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";
import { Events } from "../../types";

class CreateProfileCommand extends Command {
  constructor() {
    super({
      name: "createprofile",
      description: "creates the user's economy profile",
      expectedArgs: {
        args: "<@user>",
        minArgs: 0,
        maxArgs: 1,
      },
      category: "Economy",
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
      client.dataClient.createUser(message.author.id, message.author.username);

      message.channel.send("Successfully created profile!");
    } catch (error) {
      client.emit(Events.COMMAND_ERROR, error, this, message, client);
    }
  }
}

export default CreateProfileCommand;
