import {
  BaseInteraction,
  Client,
  EmbedBuilder,
  REST,
  Routes,
  TextBasedChannel,
  hyperlink,
} from "discord.js";

import { TOKEN, CHANNEL } from "./config.json";
import { connectDB, eventInterface, EventModel } from "./database/schema";
import wait from "wait";
import { getLastEvent } from "./Scraper";
import { Browser, Page } from "puppeteer";

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

  async getEvent(browser?: Browser) {
    try {
      const data = await getLastEvent(this.lastEvent?.ticker, browser);
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
      content: "@here",
      embeds: [embedMaker(event)],
    });
  }
}

const embedMaker = (event: eventInterface) => {
  const embed = new EmbedBuilder()
    .setTitle(`Ticker: ${event.ticker}`)
    .setDescription(`Event: ${event.scenario}`)
    .addFields([{ name: "Bearish or Bullish", value: event.bob, inline: true }])
    .setTimestamp()
    .setAuthor({
      name: "Le Scrapooor",
      iconURL: "https://i.postimg.cc/xTyBGPJG/904067125268873307.gif",
    });
  event.scenario.startsWith("Bearish")
    ? embed.setColor("#e81d17")
    : embed.setColor("#17e860");
  if (event.url) embed.setURL(event.url);
  return embed;
};
