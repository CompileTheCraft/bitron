import { Guild } from "discord.js";
import EmbedProvider from "../../providers/EmbedProvider";
import ExtendedClient from "../ExtendedClient";

class ClientDefaultEvents {
  private readonly client: ExtendedClient;

  constructor(client: ExtendedClient) {
    this.client = client;
  }

  public onGuildCreate(guild: Guild): void {
    this.client.devChannel.send({
      embeds: [EmbedProvider.onGuildCreate(guild)],
    });
  }

  public onGuildDelete(guild: Guild): void {
    this.client.devChannel.send({
      embeds: [EmbedProvider.onGuildDelete(guild)],
    });
  }
}

export default ClientDefaultEvents;
