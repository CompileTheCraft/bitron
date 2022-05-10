import { Message, MessageEmbed } from "discord.js";
import ExtendedClient from "../structures/ExtendedClient";

class DBProviderFunctions {
  public readonly client: ExtendedClient;

  constructor(client: ExtendedClient) {
    this.client = client;
  }

  private getNeededXp(lvl: number) {
    return lvl * lvl * 100;
  }

  public async xpAdd(id: string, message: Message): Promise<any> {
    const result = await this.client.dataClient.getUserById(id);

    if (!result) return;

    let { xp, lvl } = result;
    let neededXp = this.getNeededXp(lvl);

    if (xp > neededXp) {
      ++lvl;
      xp -= neededXp;
    }

    const xpEmbed = new MessageEmbed({
      description: `You leveled up!\nYou are now level ${lvl} with ${xp} experience! You need ${this.getNeededXp(
        lvl
      )} more experience to level up`,
      color: this.client.getRoleColor(message),
    });

    message.author.send({ embeds: [xpEmbed] });

    await this.client.dataClient.updateUser({ id });
  }
}

export default DBProviderFunctions;
