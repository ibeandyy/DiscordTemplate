import { connect, Schema, model } from "mongoose";

const exampleSchema = new Schema({
  name: String,
  price: Number,
  block: Number,
});

export interface exampleInterface {
  name: string;
  price: number;
  block: number;
}

export const Price = model("Price", exampleSchema);

export const connectDB = async () => {
  connect("mongodb://localhost:27017/exampleDatabse", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any);
};
