import {
  Formatters,
  Guild,
  Message,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import Command from "../structures/Command";

class EmbedProvider {
  static onCommandExecute(command: Command, message: Message): MessageEmbed {
    const embed = new MessageEmbed({
      description: `**[Command Executed]**\n\nUser: \`${
        message.author.tag
      }\`\nChannel: \`${(message.channel as TextChannel).name}\`\nGuild: \`${
        message.guild?.name
      }\`\n**Command:** \`${command.name}\``,
      color: "GREEN",
    });

    return embed;
  }

  static onCommandUndefined(cmd: string): MessageEmbed {
    const embed = new MessageEmbed({
      description: `❌ | Command ${cmd} is not available!`,
      color: "RED",
    });

    return embed;
  }

  static onCommandError(
    error: unknown,
    command: Command,
    message: Message
  ): MessageEmbed {
    const embed = new MessageEmbed({
      description: `**[Error Ocurred]**\n\nUser: \`${
        message.author.tag
      }\`\nChannel: \`${(message.channel as TextChannel).name}\`\nGuild: \`${
        message.guild?.name
      }\`\n**Command:** \`${command.name}\`\n${Formatters.codeBlock(
        String(error)
      )}`,
      color: "RED",
    });

    return embed;
  }

  static onConditionFalse(str: string): MessageEmbed {
    const embed = new MessageEmbed({
      description: `❌ | ${str}`,
      color: "RED",
    });

    return embed;
  }

  static onSuccess(str: string): MessageEmbed {
    const embed = new MessageEmbed({ description: str, color: "GREEN" });

    return embed;
  }

  static onGlobalError(error: unknown): MessageEmbed {
    const embed = new MessageEmbed({
      description: `**[Error Ocurred]*\n${Formatters.codeBlock(String(error))}`,
      color: "RED",
    });

    return embed;
  }

  static onVoiceActive(message: Message): MessageEmbed {
    const embed = new MessageEmbed({
      description: `**[Joined Voice Activity]**\nGuild: ${message.guild?.name}\nRequested By: ${message.author.username}`,
      color: "GREEN",
    });

    return embed;
  }

  static onVoiceInactive(message: Message): MessageEmbed {
    const embed = new MessageEmbed({
      description: `**[Left Voice Activity]**\nGuild: ${message.guild?.name}\nRequested By: ${message.author.username}`,
      color: "RED",
    });

    return embed;
  }

  static onDataInsert(message: Message): MessageEmbed {
    const embed = new MessageEmbed({
      description: `**[New Data Inserted]**\nRegistered Name: ${message.author.username}\nRegistered Id: ${message.author.id}`,
      color: "GREEN",
    });

    return embed;
  }

  static onDataDelete(message: Message): MessageEmbed {
    const embed = new MessageEmbed({
      description: `**[Existing Data Deleted]**\nRegistered Name: ${message.author.username}\nRegistered Id: ${message.author.id}`,
      color: "RED",
    });

    return embed;
  }

  static onGuildCreate(guild: Guild): MessageEmbed {
    const embed = new MessageEmbed({
      description: `**[Joined new guild]**\nName: ${guild.name}\nJoined at: ${guild.joinedAt}`,
      color: "GREEN",
    });

    return embed;
  }

  static onGuildDelete(guild: Guild): MessageEmbed {
    const embed = new MessageEmbed({
      description: `**[Left guild]**\nName: ${guild.name}\nLeft at: ${Date()}`,
      color: "GREEN",
    });

    return embed;
  }
}

export default EmbedProvider;
