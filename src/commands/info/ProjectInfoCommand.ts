import { Message, MessageEmbed } from "discord.js";
import fs from "fs";
import path from "path";
import Command from "../../structures/Command";
import ExtendedClient from "../../structures/ExtendedClient";
import { Events } from "../../types";

class ProjectInfoCommand extends Command {
  constructor() {
    super({
      name: "projectinfo",
      description: "shows some information about the project",
      expectedArgs: {
        args: null,
        minArgs: 0,
        maxArgs: 0,
      },
      category: "Information",
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
      let normalizedPath = path.join(process.cwd(), "/");

      let allFiles = [];

      let totalLines = 0;

      let filesCount = 0;
      let jsFilesCount = 0;
      let tsFilesCount = 0;

      const checkDir = (dir: any, fileList = []) => {
        fs.readdirSync(dir).forEach((file) => {
          if (file !== ".git" && file !== "node_modules") {
            fileList = fs.statSync(path.join(dir, file)).isDirectory()
              ? checkDir(path.join(dir, file), fileList)
              : fileList.concat(path.join(dir, file) as any);
          }
        });

        return fileList;
      };

      allFiles = checkDir(normalizedPath);

      allFiles.forEach((file: any) => {
        filesCount++;

        let matchJsFiles = file.match(/\.js$/);
        let matchTsFiles = file.match(/\.ts$/);

        let fileContent = fs.readFileSync(file).toString();

        totalLines += fileContent.split("\n").length;

        if (matchJsFiles) {
          jsFilesCount++;
        }
        if (matchTsFiles) {
          tsFilesCount++;
        }
      });

      const embed = new MessageEmbed({
        description: "**Project Info**",
        fields: [
          { name: "Files: ", value: allFiles.length.toString(), inline: true },
          { name: "Lines of Code", value: totalLines.toString(), inline: true },
          { name: "Js files", value: jsFilesCount.toString(), inline: true },
          { name: "Ts files", value: tsFilesCount.toString(), inline: true },
        ],
      });

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      client.emit(Events.COMMAND_ERROR, error, this, message, client);
    }
  }
}

export default ProjectInfoCommand;
