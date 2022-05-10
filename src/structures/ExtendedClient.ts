import { Client, Collection, Guild, Message, TextChannel } from "discord.js";
import EmbedProvider from "../providers/EmbedProvider";
import { Category, IMiscClientEvents } from "../types";
import ClientDefaultEvents from "./client/ClientDefaultEvents";
import ClientMiscEvents from "./client/ClientMiscEvents";
import ConfigProvider from "./client/ConfigProvider";
import Command from "./Command";
import DataClient from "./DataClient";
import MusicPlayer from "./MusicPlayer";
import Registry from "./Registry";

export declare interface ExtendedClient {
  on<K extends keyof IMiscClientEvents>(
    event: K,
    listener: (...args: IMiscClientEvents[K]) => void
  ): this;
  on<S extends string | symbol>(
    event: Exclude<S, keyof IMiscClientEvents>,
    listener: (...args: any[]) => void
  ): this;

  once<K extends keyof IMiscClientEvents>(
    event: K,
    listener: (...args: IMiscClientEvents[K]) => void
  ): this;
  once<S extends string | symbol>(
    event: Exclude<S, keyof IMiscClientEvents>,
    listener: (...args: any[]) => void
  ): this;

  emit<K extends keyof IMiscClientEvents>(
    event: K,
    ...args: IMiscClientEvents[K]
  ): boolean;
  emit<S extends string | symbol>(
    event: Exclude<S, keyof IMiscClientEvents>,
    ...args: any[]
  ): boolean;

  off<K extends keyof IMiscClientEvents>(
    event: K,
    listener: (...args: IMiscClientEvents[K]) => void
  ): this;
  off<S extends string | symbol>(
    event: Exclude<S, keyof IMiscClientEvents>,
    listener: (...args: any[]) => void
  ): this;

  removeAllListeners<K extends keyof IMiscClientEvents>(event?: K): this;
  removeAllListeners<S extends string | symbol>(
    event?: Exclude<S, keyof IMiscClientEvents>
  ): this;
}

export class ExtendedClient extends Client {
  private _commands: Collection<string, Command> = new Collection();
  private _events: Collection<string, any> = new Collection();
  private _cooldowns: Collection<string, any> = new Collection();
  private _categories: Set<Category> = new Set();

  public config: ConfigProvider;
  public registry: Registry;
  public player: MusicPlayer;
  public dataClient: DataClient;
  public defaultEvents: ClientDefaultEvents;

  public static readonly commandExecute = "commandExecute";
  public static readonly commandError = "commandError";
  public static readonly onGlobalError = "onGlobalError";
  public static readonly onVoiceActive = "onVoiceActive";
  public static readonly onVoiceInactive = "onVoiceInactive";
  public static readonly onDataInsert = "onDataInsert";
  public static readonly onDataDelete = "onDataDelete";

  constructor() {
    super({ intents: 32767 });

    this.config = new ConfigProvider();
    this.registry = new Registry(this);
    this.player = new MusicPlayer(this);
    this.dataClient = new DataClient(this);
    this.defaultEvents = new ClientDefaultEvents(this);

    this.registerClientDefaultEvents();
    this.registerClientMiscEvents();
  }

  get commands(): Collection<string, Command> {
    return this._commands;
  }

  get events(): Collection<string, any> {
    return this._events;
  }

  get cooldowns(): Collection<string, any> {
    return this._cooldowns;
  }

  get categories(): Set<Category> {
    return this._categories;
  }

  get devGuild(): Guild {
    return this.guilds.cache.get(this.config.devGuildID)!;
  }

  get devChannel(): TextChannel {
    return this.channels.cache.get(this.config.devChannelID) as TextChannel;
  }

  get errorChannel(): TextChannel {
    return this.channels.cache.get(this.config.errorChannelID) as TextChannel;
  }

  get bugReportChannel(): TextChannel {
    return this.channels.cache.get(
      this.config.bugReportChannelID
    ) as TextChannel;
  }

  get featureRequestChannel(): TextChannel {
    return this.channels.cache.get(
      this.config.featureRequestChannelID
    ) as TextChannel;
  }

  public getRoleColor(message: Message): `#${string}` | "GREEN" | undefined {
    const color =
      message.guild?.me?.displayHexColor === "#000000"
        ? "GREEN"
        : message.guild?.me?.displayHexColor;

    return color;
  }

  public start(): void {
    this.login(this.config.token);
    this.registerModules();
  }

  private registerModules(): void {
    this.registry.registerCommands("../commands");
    this.registry.registerEvents("../events");
  }

  private registerClientDefaultEvents(): this {
    this.on("guildCreate", this.defaultEvents.onGuildCreate);
    this.on("guildDelete", this.defaultEvents.onGuildDelete);

    return this;
  }

  private registerClientMiscEvents(): this {
    this.on("commandExecute", ClientMiscEvents.onCommandExecute);
    this.on("commandError", ClientMiscEvents.onCommandError);
    this.on("onGlobalError", ClientMiscEvents.onGlobalError);
    this.on("onVoiceActive", ClientMiscEvents.onVoiceActive);
    this.on("onVoiceInactive", ClientMiscEvents.onVoiceInactive);
    this.on("onDataInsert", ClientMiscEvents.onDataInsert);
    this.on("onDataDelete", ClientMiscEvents.onDataDelete);

    return this;
  }

  public reportError(error: unknown, command?: Command, message?: Message) {
    if (typeof command === undefined) {
      this.errorChannel.send({
        embeds: [EmbedProvider.onGlobalError(error)],
      });
    } else {
      this.errorChannel.send({
        embeds: [EmbedProvider.onCommandError(error, command!, message!)],
      });
    }
  }
}

export default ExtendedClient;
