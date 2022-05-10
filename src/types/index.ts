import { ClientEvents, Message, PermissionResolvable } from "discord.js";
import Command from "../structures/Command";
import ExtendedClient from "../structures/ExtendedClient";

interface ICommand {
  name: string;
  description: string;
  aliases: string[] | null;
  expectedArgs: args;
  category: Category;
  cooldown: number;
  userPermissions: PermissionResolvable[] | null;
  ownerOnly: boolean;
  disabled: boolean;
}

interface args {
  args: string | null;
  minArgs: number;
  maxArgs: number;
}

interface IMiscClientEvents extends ClientEvents {
  commandExecute: [Command, Message, ExtendedClient];
  commandError: [unknown, Command, Message, ExtendedClient];
  onGlobalError: [unknown, ExtendedClient];
  onVoiceActive: [Message, ExtendedClient];
  onVoiceInactive: [Message, ExtendedClient];
  onDataInsert: [Message, ExtendedClient];
  onDataDelete: [Message, ExtendedClient];
}

type Category =
  | "Utility"
  | "Information"
  | "Fun"
  | "Economy"
  | "Moderation"
  | "Music"
  | "Configuration"
  | "Development";

enum Events {
  COMMAND_EXECUTE = "commandExecute",
  COMMAND_ERROR = "commandError",
  GLOBAL_ERROR = "onGlobalError",
  VOICE_ACTIVE = "onVoiceActive",
  VOICE_INACTIVE = "onVoiceInactive",
  DATA_INSERT = "onDataInsert",
  DATA_DELETE = "onDataDelete",
}

export { ICommand, args, IMiscClientEvents, Category, Events };
