import { Message, MessageEmbed } from "discord.js";
import EmbedProvider from "../../providers/EmbedProvider";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";
import { Events } from "../../types";

class BanCommand extends Command {
  constructor() {
    super({
      name: "kick",
      description: "kicks the member/traitor mentioned",
      expectedArgs: {
        args: "<@user> <reason>",
        minArgs: 2,
        maxArgs: 256,
      },
      category: "Moderation",
      aliases: [],
      userPermissions: ["KICK_MEMBERS", "MANAGE_GUILD", "ADMINISTRATOR"],

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
      const [mentionedMember, ...reason] = args.join(" ");
      const member = message.mentions.members?.first();

      if (!mentionedMember)
        return message.reply({
          embeds: [
            EmbedProvider.onConditionFalse(
              "You did not mention anyone or the mentioned member is not in the server!"
            ),
          ],
        });
      if (!reason)
        return message.reply({
          embeds: [
            EmbedProvider.onConditionFalse("You did not provide any reason!"),
          ],
        });

      const banEmbed = new MessageEmbed({
        title: "Successful",
        description: `${mentionedMember} has been banned by ${
          message.author.username ||
          message.guild?.members.cache.get(message.author.id)?.nickname
        }\nReason: ${reason}`,
        color: client.getRoleColor(message),
      });

      const bannedMemberEmbed = new MessageEmbed({
        title: "You have been banned!",
        description: `You have been banned by ${
          message.author.username ||
          message.guild?.members.cache.get(message.author.id)?.nickname
        } from ${message.guild?.name} guild\nReason: ${reason}`,
        color: client.getRoleColor(message),
      });

      await member?.kick();

      message.channel.send({ embeds: [banEmbed] }).then((sent) =>
        setTimeout(() => {
          sent.delete();
        }, 5000)
      );

      member?.send({ embeds: [bannedMemberEmbed] });
    } catch (error) {
      client.emit(Events.COMMAND_ERROR, error, this, message, client);
    }
  }
}

export default BanCommand;
