import { Message } from "discord.js";
import EmbedProvider from "../../providers/EmbedProvider";
import Command from "../Command";
import ExtendedClient from "../ExtendedClient";

class ClientMiscEvents {
  static onCommandExecute(
    command: Command,
    message: Message,
    client: ExtendedClient
  ): void {
    client.devChannel.send({
      embeds: [EmbedProvider.onCommandExecute(command, message)],
    });
  }

  static onCommandError(
    error: unknown,
    command: Command,
    message: Message,
    client: ExtendedClient
  ): void {
    client.reportError(error, command, message);
  }

  static onGlobalError(error: unknown, client: ExtendedClient): void {
    client.reportError(error);
  }

  static onVoiceActive(message: Message, client: ExtendedClient): void {
    client.devChannel.send({
      embeds: [EmbedProvider.onVoiceActive(message)],
    });
  }

  static onVoiceInactive(message: Message, client: ExtendedClient): void {
    client.devChannel.send({
      embeds: [EmbedProvider.onVoiceInactive(message)],
    });
  }

  static onDataInsert(message: Message, client: ExtendedClient): void {
    client.devChannel.send({
      embeds: [EmbedProvider.onDataInsert(message)],
    });
  }

  static onDataDelete(message: Message, client: ExtendedClient): void {
    client.devChannel.send({
      embeds: [EmbedProvider.onDataDelete(message)],
    });
  }
}

export default ClientMiscEvents;
