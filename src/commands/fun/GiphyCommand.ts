import axios from "axios";
import { Message, MessageEmbed } from "discord.js";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";
import { Events } from "../../types";

class GiphyCommand extends Command {
  constructor() {
    super({
      name: "giphy",
      description: "sends the gif according to the query",
      expectedArgs: {
        args: "<query>",
        minArgs: 1,
        maxArgs: 128,
      },
      category: "Fun",
      aliases: ["gif"],
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
      let keywords = args.join(" ");

      let url = `https://api.giphy.com/v1/gifs/search?q=${keywords}&api_key=${client.config.giphyApi}`;
      let response = await axios(url);

      const index = Math.floor(Math.random() * response.data.data.length);

      const gif = response.data.data[index].images.original;

      const giphyEmbed = new MessageEmbed({
        title: keywords.toUpperCase(),
        thumbnail: {
          url: "https://image.ibb.co/b0Gkwo/Poweredby_640px_Black_Vert_Text.png",
        },
        image: {
          url: gif.url,
        },
        url: gif.url,
        color: client.getRoleColor(message),
      });

      message.channel.send({ embeds: [giphyEmbed] });
    } catch (error) {
      client.emit(Events.COMMAND_ERROR, error, this, message, client);
    }
  }
}

export default GiphyCommand;
