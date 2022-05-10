import { Message, MessageEmbed } from "discord.js";
import EmbedProvider from "../../providers/EmbedProvider";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";
import { Events } from "../../types";

class QueueCommand extends Command {
  constructor() {
    super({
      name: "queue",
      description: "fetches for the current queue",
      expectedArgs: {
        args: "clear",
        minArgs: 0,
        maxArgs: 2,
      },
      category: "Music",
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
      const queue = client.player.getQueue(message.guild!);

      if (!message.member?.voice.channel)
        return message.reply({
          embeds: [
            EmbedProvider.onConditionFalse(
              "You aren't connected to a voice channel!"
            ),
          ],
        });

      if (!queue?.playing)
        return message.reply({
          embeds: [
            EmbedProvider.onConditionFalse(
              "Nothing is being played right now!"
            ),
          ],
        });

      const currentTrack = queue.current;
      const tracks = queue.tracks.slice(0, 10).map((value, index) => {
        return `${index + 1}. [**${value.title}**](${value.url}) - ${
          value.requestedBy.tag
        }`;
      });

      if (args[0] === "clear") {
        queue.clear();
        return message.reply({
          embeds: [
            EmbedProvider.onSuccess(
              `Queue cleared successfully!\nby ${message.author.tag}`
            ),
          ],
        });
      }

      const queueEmbed = new MessageEmbed({
        title: "Song Queue",
        description: `${tracks.join("\n")}${
          queue.tracks.length > tracks.length
            ? `\n...${
                queue.tracks.length - tracks.length === 1
                  ? `${queue.tracks.length - tracks.length} more track`
                  : `${queue.tracks.length - tracks.length} more tracks`
              }`
            : ""
        }`,
        color: client.getRoleColor(message),
        fields: [
          {
            name: "Now Playing",
            value: `🎶 | [**${currentTrack.title}**](${currentTrack.url}) - ${currentTrack.requestedBy.tag}`,
          },
        ],
      });

      message.channel.send({ embeds: [queueEmbed] });
    } catch (error) {
      client.emit(Events.COMMAND_ERROR, error, this, message, client);
    }
  }
}

export default QueueCommand;
