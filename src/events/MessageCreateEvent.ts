import { Collection, Message } from "discord.js";
import EmbedProvider from "../providers/EmbedProvider";
import validPermissions from "../providers/validPermissions";
import Command from "../structures/Command";
import Event from "../structures/Event";
import ExtendedClient from "../structures/ExtendedClient";
import { Events } from "../types";

class MessageCreateEvent extends Event {
  private command: Command | undefined;

  constructor() {
    super("messageCreate");
  }

  async run(client: ExtendedClient, message: Message) {
    try {
      let guildProfile = await client.dataClient.getGuildById(
        message.guild?.id!
      );

      guildProfile = await client.dataClient.setupGuild(
        message.guild?.id!,
        message.guild?.name!
      );

      client.config.prefix = guildProfile?.prefix!;

      message.author.send({
        embeds: [
          EmbedProvider.onSuccess(
            `**Successfully registered your server!**\nRun \`${client.config.prefix}settings\` to update your guild settings!\n**Re-run the command**`
          ),
        ],
      });

      if (
        !message.content.startsWith(client.config.prefix) ||
        message.author.bot
      )
        return;

      if (message.channel.type == "DM")
        return message.reply({
          embeds: [
            EmbedProvider.onConditionFalse(
              "Sorry!, you cannot run commands in DM's"
            ),
          ],
        });

      const args = message.content
        .slice(client.config.prefix.length)
        .split(/ +/);
      const cmd = args.shift()?.toLowerCase();

      this.command =
        client.commands.get(cmd!) ||
        client.commands.find(
          (command) => command.aliases! && command.aliases.includes(cmd!)
        );

      if (!this.command)
        return message.reply("Command executed doesn't exist!");

      if (this.command.userPermissions?.length) {
        let invalidPermissions = [];
        for (const permission of this.command.userPermissions) {
          if (!validPermissions.includes(permission))
            return console.log(`Invalid Permission: ${permission}`);
          if (!message.member?.permissions.has(permission)) {
            invalidPermissions.push(permission);
          }
        }
        if (invalidPermissions.length) {
          return message.reply("Missing Permissions");
        }
      }

      if (!client.cooldowns.has(this.command.name)) {
        client.cooldowns.set(this.command.name, new Collection());
      }

      const currentTime: number = Date.now();
      const timestamps = client.cooldowns.get(this.command.name);
      const cooldownAmount: number = this.command.cooldown * 1000;

      if (timestamps.has(message.author.id)) {
        const expirationTime: number =
          timestamps.get(message.author.id) + cooldownAmount;

        if (currentTime < expirationTime) {
          let timeLeft = (expirationTime - currentTime) / 1000;
          timeLeft = parseInt(timeLeft.toFixed());
        }

        return message.reply("Cool down bud");
      }

      timestamps.set(message.author.id, currentTime);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

      if (this.command.expectedArgs.maxArgs < args.length)
        return message.reply("You entered more arguments");

      if (this.command.expectedArgs.minArgs > args.length)
        return message.reply("You didn't enter correct arguments");

      if (this.command.disabled)
        return message.reply("Command is disabled by the developer");

      if (this.command.ownerOnly) {
        if (
          !(
            message.author.id === client.config.ownerID ||
            message.author.id === client.config.coOwnerID
          )
        )
          return message.reply("Only the owner can execute this command");

        this.command.run(client, message, args, cmd!);
        client.emit(Events.COMMAND_EXECUTE, this.command, message, client);
      } else {
        this.command.run(client, message, args, cmd!);
        client.emit(Events.COMMAND_EXECUTE, this.command, message, client);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default MessageCreateEvent;
