import Event from "../structures/Event";
import ExtendedClient from "../structures/ExtendedClient";

class ReadyEvent extends Event {
  constructor() {
    super("ready");
  }

  run(client: ExtendedClient) {
    console.log(`${client.user?.tag} has logged in! 🟢`);
    client.devChannel.send(`${client.user?.tag} has logged in! 🟢`);
  }
}

export default ReadyEvent;
