import { DiscordClient } from "./DiscordClient";

const main = async () => {
  const client = new DiscordClient();
  await client.initialize();
};
main();
