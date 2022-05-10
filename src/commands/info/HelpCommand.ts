import { EmbedFieldData, Message, MessageEmbed } from "discord.js";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";
import { Category } from "../../types";
import { Events } from "../../types";

class HelpCommand extends Command {
  constructor() {
    super({
      name: "help",
      description: "shows the list of commands",
      expectedArgs: {
        args: "<command>",
        minArgs: 0,
        maxArgs: 1,
      },
      category: "Information",
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
      const commandFields: EmbedFieldData[] = [...client.categories].map(
        (value: Category) => {
          return {
            name: `${value[0] + value.slice(1)} [${
              client.commands.filter(
                (command: Command) => command.category === value
              ).size
            }]`,
            value: client.commands
              .filter((command: Command) => command.category === value)
              .map((trigger: Command) => `\`${trigger.name}\``)
              .join(", "),
          };
        }
      );

      const embed = new MessageEmbed({
        description: `Prefix: \`${client.config.prefix}\`\nGet information about a specific command with \`${client.config.prefix}help [command_name]\``,
        fields: commandFields,
        color: client.getRoleColor(message),
      });

      if (!args.length) return message.channel.send({ embeds: [embed] });
      const command = client.commands.get(args[0]);

      if (!command) return message.channel.send({ embeds: [embed] });

      const helpEmbed = new MessageEmbed({
        title: `Command: ${command.name}`,
        description: `**Description:** ${command.description}\n**Category:** ${command.category}`,
        fields: [
          {
            name: "Alias",
            value: `${command.aliases?.join(", ") || "none"}`,
          },
          {
            name: "Arguments",
            value: `${command.expectedArgs.args}\n**Maximum Arguments: ${command.expectedArgs.maxArgs}**\n**Minimum Arguments: ${command.expectedArgs.minArgs}**`,
          },
        ],
        color: client.getRoleColor(message),
      });

      return message.channel.send({ embeds: [helpEmbed] });
    } catch (error) {
      client.emit(Events.COMMAND_ERROR, error, this, message, client);
    }
  }
}

export default HelpCommand;
