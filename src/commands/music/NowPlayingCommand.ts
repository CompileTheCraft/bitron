import { Message, MessageEmbed } from "discord.js";
import EmbedProvider from "../../providers/EmbedProvider";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";
import { Events } from "../../types";

class NowPlayingCommand extends Command {
  constructor() {
    super({
      name: "nowplaying",
      description: "shows the currently playing music",
      expectedArgs: {
        args: null,
        minArgs: 0,
        maxArgs: 0,
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

      const progress = queue.createProgressBar();
      const percent = queue.getPlayerTimestamp();

      const nowPlayingEmbed = new MessageEmbed({
        title: "Now Playing",
        description: `🎶 | **${queue.current.title}**! (\`${percent.progress}%\`)`,
        fields: [{ name: "\u200b", value: progress }],
        color: client.getRoleColor(message),
        footer: { text: `Queued by ${queue.current.requestedBy.tag}` },
      });

      message.channel.send({ embeds: [nowPlayingEmbed] });
    } catch (error) {
      client.emit(Events.COMMAND_ERROR, error, this, message, client);
    }
  }
}

export default NowPlayingCommand;
