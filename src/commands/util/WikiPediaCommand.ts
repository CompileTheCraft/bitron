import { Message, MessageEmbed } from "discord.js";
import axios from "axios";
import EmbedProvider from "../../providers/EmbedProvider";
import { Events } from "../../types";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";

class WikiPediaCommand extends Command {
  constructor() {
    super({
      name: "wikipedia",
      description: "searches the wikipedia and shows the result",
      expectedArgs: {
        args: "<query>",
        minArgs: 1,
        maxArgs: 256,
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
      let query = args.join(" ");

      if (!query)
        return message.reply({
          embeds: [EmbedProvider.onConditionFalse("Provide a valid query!")],
        });

      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        query
      )}`;

      let response: any;

      response = await axios(url);

      const wikipediaImage =
        "https://imgr.search.brave.com/n5sAVV3slSTrwFxwLJ8xTf8UIpvFfGzHzQLeOUJKT8k/fit/640/360/no/1/aHR0cHM6Ly9uZXdh/Z29yYS5jYS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAxOS8wOC9X/aWtpcGVkaWEtTG9n/by1vbi1CbGFjay5q/cGc";

      if (response.data.type === "diambiguation") {
        const embed = new MessageEmbed({
          title: "Result",
          description: `${response.extract}\nLinks for topic you searched [Link](${response.data.content_urls.desktop.page}).`,
          author: { name: "Wikipedia", iconURL: wikipediaImage },
          url: response.data.content_urls.desktop.page,
          color: client.getRoleColor(message),
          timestamp: Date.now(),
        });

        message.channel.send({ embeds: [embed] });
      } else {
        const embed = new MessageEmbed({
          title: "Result",
          description: response.data.extract,
          author: { name: "Wikipedia", iconURL: wikipediaImage },
          url: response.data.content_urls.desktop.page,
          color: client.getRoleColor(message),
          timestamp: Date.now(),
        });

        message.channel.send({ embeds: [embed] });
      }
    } catch (error) {
      client.emit(Events.COMMAND_ERROR, error, this, message, client);
    }
  }
}

export default WikiPediaCommand;
