import axios from "axios";
import { Message, MessageEmbed } from "discord.js";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";
import { Events } from "../../types";

class MemeCommand extends Command {
  constructor() {
    super({
      name: "meme",
      description: "sends a meme!",
      expectedArgs: {
        args: null,
        minArgs: 0,
        maxArgs: 0,
      },
      category: "Fun",
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
      const url = "https://some-random-api.ml/meme";

      let data, response;

      response = await axios(url);
      data = (response as any).data;

      const embed = new MessageEmbed({
        title: data.caption,
        color: client.getRoleColor(message),
        image: { url: data.image },
      });

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      client.emit(Events.COMMAND_ERROR, error, this, message, client);
    }
  }
}

export default MemeCommand;
