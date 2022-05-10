import { Message, PermissionResolvable } from "discord.js";
import { args, Category, ICommand } from "../types";
import ExtendedClient from "./ExtendedClient";

abstract class Command {
  public name: string;
  public description: string;
  public aliases: string[] | null;
  public expectedArgs: args;
  public category: Category;
  public cooldown: number;
  public userPermissions: PermissionResolvable[] | null;
  public ownerOnly: boolean;
  public disabled: boolean;

  constructor(options: ICommand) {
    this.name = options.name;
    this.description = options.description;
    this.aliases = options.aliases;
    this.expectedArgs = options.expectedArgs;
    this.category = options.category;
    this.cooldown = options.cooldown;
    this.userPermissions = options.userPermissions;
    this.ownerOnly = options.ownerOnly;
    this.disabled = options.disabled;
  }

  abstract run(
    client: ExtendedClient,
    message: Message,
    args: string[] | null,
    cmd: string | null
  ): Promise<Message | void>;
}

export default Command;
