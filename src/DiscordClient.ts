import { BaseInteraction, Client, REST, Routes } from "discord.js";

import { token, clientId } from "./config.json";
import { connectDB } from "./database/schema";
import wait from "wait";

export class DiscordClient extends Client {
  constructor() {
    super({ intents: 131071 });
    this.listenButtons();
  }
  async initialize() {
    connectDB();

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
}
