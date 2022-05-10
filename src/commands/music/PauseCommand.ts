import { Message, MessageEmbed } from "discord.js";
import EmbedProvider from "../../providers/EmbedProvider";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";
import { Events } from "../../types";

class PauseCommand extends Command {
  constructor() {
    super({
      name: "pause",
      description: "pauses the current track",
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

      queue.setPaused(true);

      const pausedEmbed = new MessageEmbed({
        title: "Paused",
        description: `▶ | [**${queue.current.title}**](${queue.current.url}) - ${queue.current.requestedBy.tag}`,
        color: client.getRoleColor(message),
      });

      message.channel.send({ embeds: [pausedEmbed] });
    } catch (error) {
      client.emit(Events.COMMAND_ERROR, error, this, message, client);
    }
  }
}

export default PauseCommand;
