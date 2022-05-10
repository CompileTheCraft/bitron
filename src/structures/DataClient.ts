import { PrismaClient } from "@prisma/client";
import type { User, Guild } from ".prisma/client";
import ExtendedClient from "./ExtendedClient";
import DBProviderFunctions from "../providers/DBProviderFunctions";

class DataClient extends PrismaClient {
  public readonly client: ExtendedClient;
  public functions: DBProviderFunctions;

  constructor(client: ExtendedClient) {
    super();

    this.client = client;
    this.functions = new DBProviderFunctions(this.client);
  }

  public async createUser(id: string, username: string): Promise<User> {
    return await this.user.create({
      data: {
        id,
        username,
      },
    });
  }

  public async getUserById(id: string): Promise<User | null> {
    return await this.user.findUnique({
      where: {
        id,
      },
    });
  }

  public async deleteUser(id: string): Promise<User | null> {
    return await this.user.delete({
      where: {
        id,
      },
    });
  }

  public async updateUser(options: {
    id: string;
    bits?: number;
    bank?: number;
    commandsRan?: number;
    xp?: number;
    lvl?: number;
    user?: User;
  }) {
    return await this.user.upsert({
      where: {
        id: options.id,
      },
      update:
        options.bits! ||
        options.bank! ||
        options.commandsRan! ||
        options.xp! ||
        options.lvl!,
      create: options.user!,
    });
  }

  public async setupGuild(id: string, name: string): Promise<Guild> {
    return await this.guild.create({
      data: { id, name },
    });
  }

  public async updateGuild(options: {
    id: string;
    name?: number;
    prefix?: string;
    robbing?: boolean;
    logging?: boolean;
    loggingChannelID?: string;
    guild?: Guild;
  }) {
    return await this.guild.upsert({
      where: {
        id: options.id,
      },
      update:
        options.prefix! ||
        options.robbing! ||
        options.logging! ||
        options.loggingChannelID!,
      create: options.guild!,
    });
  }

  public async getGuildById(id: string): Promise<Guild | null> {
    return await this.guild.findUnique({
      where: {
        id,
      },
    });
  }
}

export default DataClient;
