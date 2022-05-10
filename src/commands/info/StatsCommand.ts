import { Message } from "discord.js";
import PACKAGE from "../../../package.json";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";
import { Events } from "../../types";

class StatsCommand extends Command {
  constructor() {
    super({
      name: "stats",
      description: "shows some stats of the bot",
      expectedArgs: {
        args: null,
        minArgs: 0,
        maxArgs: 0,
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
      const stats = `\`\`\`Memory\n${this.memoryUsed()}\n\n----------\n\nServers: ${
        client.guilds.cache.size
      }\nUsers: ${client.users.cache.size}\nChannels: ${
        client.channels.cache.size
      }\n\n----------\n\nBitron Version: ${
        PACKAGE.version
      }\nUptime: ${this.resolveUptime(client.uptime!)}\nNumber of Commands: ${
        client.commands.size
      }\`\`\``;
      message.channel.send(stats);
    } catch (error) {
      client.emit(Events.COMMAND_ERROR, error, this, message, client);
    }
  }

  public resolveUptime(uptime: number): string {
    let days = Math.floor(uptime / 86400000);
    let hours = Math.floor(uptime / 3600000) % 24;
    let minutes = Math.floor(uptime / 60000) % 60;
    let seconds = Math.floor(uptime / 1000) % 60;

    const daysDisplay =
      days > 0 ? days + (days == 1 ? " day, " : " days, ") : "";
    const hoursDisplay =
      hours > 0 ? hours + (hours == 1 ? " hour, " : " hours, ") : "";
    const minuteDisplay =
      minutes > 0 ? minutes + (minutes == 1 ? " minute, " : " minutes, ") : "";
    const secondsDisplay =
      seconds > 0 ? seconds + (seconds == 1 ? " second" : " seconds, ") : "";

    return `${daysDisplay}${hoursDisplay}${minuteDisplay}${secondsDisplay}`;
  }

  public memoryUsed(): string {
    const usedMemory = process.memoryUsage();

    let usedMemoryString: string;

    const rssMemory = Math.floor(usedMemory.rss / 1024 / 1024);
    const heapTotalMemory = Math.floor(usedMemory.heapTotal / 1024 / 1024);
    const heapUsedMemory = Math.floor(usedMemory.heapUsed / 1024 / 1024);
    const externalMemory = Math.floor(usedMemory.external / 1024 / 1024);

    usedMemoryString = `Resident Set Size: ${rssMemory} MB\nHeap Total: ${heapTotalMemory} MB\nHeap Used: ${heapUsedMemory} MB\nExternal: ${externalMemory} MB`;

    return usedMemoryString;
  }
}

export default StatsCommand;
