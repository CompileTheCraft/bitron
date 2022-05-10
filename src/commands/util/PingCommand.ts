import { ColorResolvable, Message, MessageEmbed } from "discord.js";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";
import { Events } from "../../types";

class PingCommand extends Command {
  constructor() {
    super({
      name: "ping",
      description: "shows the latency of the bot",
      expectedArgs: {
        args: null,
        minArgs: 0,
        maxArgs: 0,
      },
      category: "Utility",
      aliases: ["latency"],
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
      const clientPing = client.ws.ping;
      const pingEmojiChecker: string =
        clientPing > 1000
          ? ":red_circle:"
          : clientPing > 500
          ? ":orange_circle:"
          : ":green_circle:";
      const pingEmbedColorChecker: ColorResolvable =
        clientPing > 1000 ? "RED" : clientPing > 500 ? "ORANGE" : "GREEN";

      const pingEmbed = new MessageEmbed({
        title: "Pong! 🏓",
        description: `Ping: **${clientPing}ms** ${pingEmojiChecker}`,
        color: pingEmbedColorChecker,
      });

      message.channel.send({ embeds: [pingEmbed] });
    } catch (error) {
      client.emit(Events.COMMAND_ERROR, error, this, message, client);
    }
  }
}

export default PingCommand;
