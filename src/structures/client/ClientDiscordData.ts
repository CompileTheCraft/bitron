import { ColorResolvable, Guild, Message, TextChannel } from "discord.js";
import ExtendedClient from "../ExtendedClient";

class ClientDiscordData {
  private readonly client: ExtendedClient;

  constructor(client: ExtendedClient) {
    this.client = client;
  }

  public get devGuild(): Guild {
    return this.client.guilds.cache.get(this.client.config.devGuildID)!;
  }

  public get devChannel(): TextChannel {
    return this.client.channels.cache.get(
      this.client.config.devChannelID
    ) as TextChannel;
  }

  public get errorChannel(): TextChannel {
    return this.client.channels.cache.get(
      this.client.config.errorChannelID
    ) as TextChannel;
  }

  public get bugReportChannel(): TextChannel {
    return this.client.channels.cache.get(
      this.client.config.bugReportChannelID
    ) as TextChannel;
  }

  public get featureRequestChannel(): TextChannel {
    return this.client.channels.cache.get(
      this.client.config.featureRequestChannelID
    ) as TextChannel;
  }

  public getRoleColor(message: Message): `#${string}` | "GREEN" | undefined {
    const color =
      message.guild?.me?.displayHexColor === "#000000"
        ? "GREEN"
        : message.guild?.me?.displayHexColor;

    return color;
  }
}

export default ClientDiscordData;
