import { Player } from "discord-player";
import { Message } from "discord.js";
import ExtendedClient from "./ExtendedClient";

class MusicPlayer extends Player {
  public ytIconUrl: string =
    "https://imgs.search.brave.com/tqrZ8s4xxYf_pQ6j2hYxjOpCgjcTO3eVS0GPYShM9dw/rs:fit:482:225:1/g:ce/aHR0cHM6Ly90c2Uy/Lm1tLmJpbmcubmV0/L3RoP2lkPU9JUC52/SFhvU3FqTGVMYk1i/TmtVWUZqdHJnSGFI/UyZwaWQ9QXBp";
  public spotifyIconUrl: string =
    "https://imgs.search.brave.com/UhOCzSDw-rmU8M_XxyjzkSlQ2lWufrBFP4eJFO4J1HA/rs:fit:474:225:1/g:ce/aHR0cHM6Ly90c2Ux/Lm1tLmJpbmcubmV0/L3RoP2lkPU9JUC5B/T0Z0WU5YcF9ibWxH/YkNIT0hldFZRSGFI/YSZwaWQ9QXBp";
  public soundCloudIconUrl: string =
    "https://imgs.search.brave.com/NwLS5eEgbwOGQazjp3SI9Ft8kKqm7nPnrKBX0GXakJ8/rs:fit:474:225:1/g:ce/aHR0cHM6Ly90c2U0/Lm1tLmJpbmcubmV0/L3RoP2lkPU9JUC5l/ZU14Z19MWjlTU2o0/ZGNISEhYa2J3SGFI/YSZwaWQ9QXBp";
  public arbitraryIconUrl: string =
    "https://imgs.search.brave.com/2r772PDn66GkRz88T8VDXTR5vYmLK70YS2fIbqoSx40/rs:fit:256:225:1/g:ce/aHR0cHM6Ly90c2U0/Lm1tLmJpbmcubmV0/L3RoP2lkPU9JUC5L/eW5rQUhCUEQtV0pp/ejh4V1hxOE9RQUFB/QSZwaWQ9QXBp";

  constructor(client: ExtendedClient) {
    super(client, {
      ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
      },
    });
  }

  async queue(message: Message) {
    const queue = await this.createQueue(message.guild!, {
      metadata: message.channel,
    });

    return queue;
  }
}

export default MusicPlayer;
