import {
  BaseInteraction,
  Client,
  REST,
  Routes,
  TextBasedChannel,
} from "discord.js";

import { TOKEN, CHANNEL } from "./config.json";
import { connectDB, eventInterface, EventModel } from "./database/schema";
import wait from "wait";
import { getLastEvent } from "./Scraper";

export class DiscordClient extends Client {
  lastEvent: eventInterface | undefined;
  channel: TextBasedChannel | undefined;
  constructor() {
    super({ intents: 131071 });
    this.listenButtons();
  }
  async initialize() {
    connectDB();
    await this.login(TOKEN);
    this.lastEvent =
      ((await EventModel.findOne({})
        .sort({ _id: -1 })
        .lean()) as eventInterface) || undefined;
    this.channel = (await this.channels.fetch(CHANNEL)) as TextBasedChannel;
    this.getEvent();
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

  async getEvent() {
    try {
      const data = await getLastEvent();
      if (data) {
        if (this.lastEvent?.ticker !== data.ticker) {
          this.lastEvent = (await new EventModel(
            data
          ).save()) as eventInterface;
          await this.sendEvent(this.lastEvent);
        }
      }
    } catch (e) {
      console.log(e);
    }

    await wait(500);
    this.getEvent();
  }
  async sendEvent(event: eventInterface) {
    if (!this.channel) return;
    this.channel.send({
      content: `@here new event detected: **${event.ticker}** -- ${event.scenario} -- ${event.date} -- ${event.bob}`,
    });
  }
}
