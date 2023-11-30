import { config } from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const TOKEN = process.env.BOT_TOKEN;

client.login(TOKEN);

client.on("messageCreate", (msg) => {
  if (msg.content === "ping") {
    msg.channel.send("pong");
  }
});
