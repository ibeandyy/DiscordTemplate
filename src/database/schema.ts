import { connect, Schema, model } from "mongoose";
import { URI } from "../config.json";
import { Browser } from "puppeteer";
const eventSchema = new Schema({
  ticker: String,
  scenario: String,
  bob: String,
  date: String,
  url: { type: String, required: false },
});

export interface eventInterface {
  ticker: string;
  scenario: string;
  bob: string;
  date: string;
  url?: string;
  browser: Browser;
}

export const EventModel = model("Event", eventSchema);

export const connectDB = async () => {
  connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any);
};
