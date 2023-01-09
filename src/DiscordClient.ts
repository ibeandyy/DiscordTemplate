import { BaseInteraction, Client, REST, Routes } from "discord.js";

import { token, clientId } from "./config.json";

import wait from "wait";

export class DiscordClient extends Client {
  constructor() {
    super({ intents: 131071 });
    this.listenButtons();
  }
  async initialize() {
    await this.login(token);
  }
  listenButtons() {
    this.on("interactionCreate", async (interaction: BaseInteraction) => {
      if (!interaction.isButton()) return;
      if (interaction.customId === "babelight") {
        try {
          await interaction.deferReply({ ephemeral: true });
        } catch (e) {}
      }
    });
  }
  setCommands() {
    let commands = [];
    // const lsdPositions = LSDPositions.toJSON();

    // commands.push(lsdPositions);
    const rest = new REST({ version: "10" }).setToken(data.TOKEN);
    rest
      .put(Routes.applicationGuildCommands(data.CLIENTID, data.GUILD), {
        body: commands,
      })
      .then((data: any) =>
        console.log(
          `Successfully registered ${data.length} application commands.`
        )
      )
      .catch(console.error);
  }
}
