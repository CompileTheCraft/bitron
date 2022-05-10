import { Message, MessageEmbed } from "discord.js";
import EmbedProvider from "../../providers/EmbedProvider";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";
import { Events } from "../../types";

class SkipCommand extends Command {
  constructor() {
    super({
      name: "skip",
      description: "skips the current song",
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

      const skipEmbed = new MessageEmbed({
        title: "Skipped!",
        description: `Skipped the current track [**${queue.current.title}**](${queue.current.url})`,
        color: client.getRoleColor(message),
      });

      message.channel.send({ embeds: [skipEmbed] });

      await queue.skip();
    } catch (error) {
      client.emit(Events.COMMAND_ERROR, error, this, message, client);
    }
  }
}

export default SkipCommand;
