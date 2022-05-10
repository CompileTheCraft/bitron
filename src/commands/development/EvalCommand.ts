import { Formatters, Message } from "discord.js";
import { inspect } from "util";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";
import { Events } from "../../types";

class EvalCommand extends Command {
  constructor() {
    super({
      name: "eval",
      description: "runs the code",
      expectedArgs: {
        args: "<code>",
        minArgs: 0,
        maxArgs: 2048,
      },
      category: "Development",
      cooldown: 10,
      aliases: [],
      userPermissions: [],

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
      const code = args.join(" ");

      const result = await eval(code);

      let output = result;

      if (typeof result !== "string") {
        output = inspect(result);
      }

      const formattedOutput = Formatters.codeBlock("js", output);

      message.channel.send(formattedOutput);
    } catch (error) {
      client.emit(Events.COMMAND_ERROR, error, this, message, client);
    }
  }
}

export default EvalCommand;
