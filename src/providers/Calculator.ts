import { Message, MessageEmbed } from "discord.js";
import ExtendedClient from "../structures/ExtendedClient";

class Calculator {
  private readonly client: ExtendedClient;

  constructor(client: ExtendedClient) {
    this.client = client;
  }

  private embed(result: number, message: Message) {
    const embed = new MessageEmbed({
      description: `Result: **${result}**`,
      color: this.client.getRoleColor(message),
    });

    message.channel.send({ embeds: [embed] });
  }

  public add(num1: number, num2: number, message: Message): void {
    this.embed(num1 + num2, message);
  }

  public subtract(num1: number, num2: number, message: Message): void {
    this.embed(num1 - num2, message);
  }

  public multiply(num1: number, num2: number, message: Message): void {
    this.embed(num1 * num2, message);
  }

  public divide(num1: number, num2: number, message: Message): void {
    this.embed(num1 / num2, message);
  }

  public modulo(num1: number, num2: number, message: Message): void {
    this.embed(num1 % num2, message);
  }

  public percentage(num1: number, num2: number, message: Message): void {
    this.embed((num1 / num2) * 100, message);
  }

  public square(num: number, message: Message): void {
    this.embed(num * num, message);
  }

  public cube(num: number, message: Message): void {
    this.embed(num * num * num, message);
  }

  public squareRoot(num: number, message: Message): void {
    this.embed(Math.sqrt(num), message);
  }

  public cubeRoot(num: number, message: Message): void {
    this.embed(Math.cbrt(num), message);
  }

  public power(num1: number, num2: number, message: Message): void {
    this.embed(Math.pow(num1, num2), message);
  }
}

export default Calculator;
