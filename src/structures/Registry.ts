import { promises as fs } from "fs";
import path from "path";
import ExtendedClient from "./ExtendedClient";

class Registry {
  private readonly client: ExtendedClient;

  constructor(client: ExtendedClient) {
    this.client = client;
  }

  public async registerCommands(dir: string = ""): Promise<void> {
    const filePath = path.join(__dirname, dir);
    const files = await fs.readdir(filePath);

    for (const file of files) {
      const stat = await fs.lstat(path.join(filePath, file));

      if (stat.isDirectory()) this.registerCommands(path.join(dir, file));
      if (file.endsWith(".ts") || file.endsWith(".js")) {
        const { default: Command } = await import(path.join(dir, file));
        const command = new Command();
        this.client.commands.set(command.name, command);
        this.client.categories.add(command.category);
      }
    }
  }

  public async registerEvents(dir: string = ""): Promise<void> {
    const filePath = path.join(__dirname, dir);
    const files = await fs.readdir(filePath);

    for (const file of files) {
      const stat = await fs.lstat(path.join(filePath, file));

      if (stat.isDirectory()) this.registerEvents(path.join(dir, file));
      if (file.endsWith(".ts") || file.endsWith(".js")) {
        const { default: Event } = await import(path.join(dir, file));
        const event = new Event();
        this.client.events.set(event.name, event);
        this.client.on(event.name, event.run.bind(event, this.client));
      }
    }
  }
}

export default Registry;
