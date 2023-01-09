import { connect, Schema, model } from "mongoose";

const eventSchema = new Schema({
  ticker: String,
  scenario: String,
  bob: String,
  date: String,
});

export interface eventInterface {
  ticker: string;
  scenario: string;
  bob: string;
  date: string;
}

export const EventModel = model("Event", eventSchema);

export const connectDB = async () => {
  connect("mongodb://localhost:27017/Events", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any);
};
