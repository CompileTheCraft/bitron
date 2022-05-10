import { QueryType } from "discord-player";
import { Message, MessageEmbed } from "discord.js";
import EmbedProvider from "../../providers/EmbedProvider";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";
import { Events } from "../../types";

class PlayCommand extends Command {
  constructor() {
    super({
      name: "play",
      description: "plays the mentioned song",
      expectedArgs: {
        args: "<song/url>",
        minArgs: 1,
        maxArgs: 256,
      },
      category: "Music",
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
      const songTitle = args.join(" ");

      if (!message.member?.voice.channel)
        return message.reply({
          embeds: [
            EmbedProvider.onConditionFalse(
              "You aren't connected to a voice channel!"
            ),
          ],
        });

      const searchResult = await client.player.search(songTitle, {
        requestedBy: message.author,
        searchEngine: QueryType.AUTO,
      });

      const queue = await client.player.queue(message);

      if (!queue.connection) await queue.connect(message.member.voice.channel);

      searchResult.playlist
        ? queue.addTracks(searchResult.tracks)
        : queue.addTrack(searchResult.tracks[0]);

      const source = queue.current.source;

      const playEmbed = new MessageEmbed({
        title: "Playing",
        description: `🎶 | Playing the track [**${queue.current.title}**](${queue.current.url})\nFor more info check \`${client.config.prefix}nowplaying\` or \`${client.config.prefix}queue\``,
        author: {
          name:
            source === "youtube"
              ? "YouTube"
              : source === "spotify"
              ? "Spotify"
              : source === "soundcloud"
              ? "SoundCloud"
              : "Arbitrary",
          iconURL:
            source === "youtube"
              ? client.player.ytIconUrl
              : source === "spotify"
              ? client.player.spotifyIconUrl
              : source === "soundcloud"
              ? client.player.soundCloudIconUrl
              : client.player.arbitraryIconUrl,
        },
        footer: { text: `Requested by ${queue.current.requestedBy.tag}` },
      });

      message.channel.send({
        embeds: [playEmbed],
      });

      if (!queue?.playing) await queue.play();
    } catch (error) {
      client.emit(Events.COMMAND_ERROR, error, this, message, client);
    }
  }
}

export default PlayCommand;
