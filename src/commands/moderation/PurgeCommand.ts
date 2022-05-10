import { Message, MessageEmbed, TextChannel } from "discord.js";
import EmbedProvider from "../../providers/EmbedProvider";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";
import { Events } from "../../types";

class PurgeCommand extends Command {
  constructor() {
    super({
      name: "purge",
      description: "purges the amount of messages specified",
      expectedArgs: {
        args: "<number>",
        minArgs: 1,
        maxArgs: 1,
      },
      category: "Moderation",
      aliases: ["clear", "clean", "delete", "del", "cc"],
      userPermissions: [
        "MANAGE_MESSAGES",
        "MANAGE_CHANNELS",
        "MANAGE_GUILD",
        "ADMINISTRATOR",
      ],

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
      if (args.length > 1)
        return message.reply({
          embeds: [
            EmbedProvider.onConditionFalse(
              "You gave more number of arguments!"
            ),
          ],
        });
      const amount = parseInt(args[0]);

      if (amount > 100)
        return message.reply({
          embeds: [
            EmbedProvider.onConditionFalse(
              "The amount of messages to be deleted is set by discord only upto 100 messages. **You exceeded the limit**"
            ),
          ],
        });
      if (amount < 1)
        return message.reply({
          embeds: [
            EmbedProvider.onConditionFalse(
              "The amount of messages that should be deleted must be a natural number!"
            ),
          ],
        });

      const fetchedMessages = await message.channel.messages.fetch({
        limit: amount,
      });

      if (message.channel.type === "GUILD_TEXT") {
        await message.channel.bulkDelete(fetchedMessages).then((messages) => {
          const purgeEmbed = new MessageEmbed({
            description: `Deleted \`${messages.size}\` messages in **${
              (message.channel as TextChannel).name
            }**`,
            color: "GREEN",
          });
          message.channel.send({ embeds: [purgeEmbed] }).then((sent) =>
            setTimeout(() => {
              sent.delete();
            }, 5000)
          );
        });
      }
    } catch (error) {
      client.emit(Events.COMMAND_ERROR, error, this, message, client);
    }
  }
}

export default PurgeCommand;
