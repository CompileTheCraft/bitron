import ExtendedClient from "./ExtendedClient";

abstract class Event {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract run(client: ExtendedClient, ...args: any): void;
}

export default Event;
