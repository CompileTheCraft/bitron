import { Message } from "discord.js";
import EmbedProvider from "../../providers/EmbedProvider";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";
import { Events } from "../../types";

class ShutDownCommand extends Command {
  constructor() {
    super({
      name: "shutdown",
      description: "shutdowns the bot",
      expectedArgs: {
        args: null,
        minArgs: 0,
        maxArgs: 0,
      },
      category: "Development",
      cooldown: 10,
      aliases: ["quit", "exit"],
      userPermissions: [],

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
      await message.channel
        .send({
          embeds: [EmbedProvider.onSuccess("**Shutting Down!...**")],
        })
        .then(async (sent) => {
          setTimeout(async () => {
            await sent.edit({
              embeds: [
                EmbedProvider.onSuccess(
                  `**Successful!**\nShut Down requested at: ${Date()}`
                ),
              ],
            });
          }, 5000);

          process.exit(1);
        });
    } catch (error) {
      client.emit(Events.COMMAND_ERROR, error, this, message, client);
    }
  }
}

export default ShutDownCommand;
