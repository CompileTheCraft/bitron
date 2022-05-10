import { Message } from "discord.js";
import Calculator from "../../providers/Calculator";
import EmbedProvider from "../../providers/EmbedProvider";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";
import { Events } from "../../types";

class MathCommand extends Command {
  constructor() {
    super({
      name: "math",
      description: "does some arithmetic problems",
      expectedArgs: {
        args: "<add/subtract/multiply/divide/modulo/percentage/square/cube/sqrt/cbrt/power> <num1> <num2>",
        minArgs: 2,
        maxArgs: 3,
      },
      category: "Utility",
      aliases: [],
      userPermissions: [],

      cooldown: 10,
      ownerOnly: false,
      disabled: false,
    });
  }
  async run(
    client: ExtendedClient,
    message: Message,
    args: string[],
    cmd: string
  ) {
    try {
      const arithmeticOperations = args[0];
      const num1: number = parseInt(args[1]);
      const num2: number = parseInt(args[2]);

      const calc = new Calculator(client);

      if (isNaN(num1))
        return message.reply({
          embeds: [
            EmbedProvider.onConditionFalse(
              "The value provided is **not a number**"
            ),
          ],
        });

      if (arithmeticOperations === "square") {
        return calc.square(num1, message);
      } else if (arithmeticOperations === "cube") {
        return calc.cube(num1, message);
      } else if (
        arithmeticOperations === "squareRoot" ||
        arithmeticOperations === "sqrt"
      ) {
        return calc.squareRoot(num1, message);
      } else if (
        arithmeticOperations === "cubeRoot" ||
        arithmeticOperations === "cbrt"
      ) {
        return calc.cubeRoot(num1, message);
      } else if (
        arithmeticOperations === "power" ||
        arithmeticOperations === "pow"
      ) {
        return calc.power(num1, num2, message);
      }

      if (isNaN(num2))
        return message.reply({
          embeds: [
            EmbedProvider.onConditionFalse(
              "The value provided is **not a number**"
            ),
          ],
        });

      if (arithmeticOperations === "add") {
        return calc.add(num1, num2, message);
      } else if (
        arithmeticOperations === "subtract" ||
        arithmeticOperations === "sub"
      ) {
        return calc.subtract(num1, num2, message);
      } else if (arithmeticOperations === "multiply") {
        return calc.multiply(num1, num2, message);
      } else if (arithmeticOperations === "divide") {
        return calc.divide(num1, num2, message);
      } else if (
        arithmeticOperations === "modulo" ||
        arithmeticOperations === "mod"
      ) {
        return calc.modulo(num1, num2, message);
      } else if (
        arithmeticOperations === "percentage" ||
        arithmeticOperations === "perc"
      ) {
        return calc.percentage(num1, num2, message);
      }
    } catch (error) {
      client.emit(Events.COMMAND_ERROR, error, this, message, client);
    }
  }
}

export default MathCommand;
