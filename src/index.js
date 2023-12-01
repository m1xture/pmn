import { config } from "dotenv";
import { Client, GatewayIntentBits, Guild, Routes } from "discord.js";
import { REST } from "@discordjs/rest";
config();

const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const rest = new REST({ version: "10" }).setToken(TOKEN);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("interactionCreate", (interaction) => {
  if (interaction.isChatInputCommand()) {
    // console.log(interaction.options);
    // console.log(interaction.options.data);
    // console.log(interaction.options.getString("food")); //? get = object
    //todo: interaction.reply({ content: interaction.options.getString("food") });
    // console.log(interaction);

    switch (interaction.commandName) {
      case "max":
        let maxNum = 0;
        console.log(interaction.options.data);
        interaction.options.data.forEach((obj) => {
          const num = Number(obj.value);
          if (num > maxNum) {
            maxNum = num;
          }
        });
        interaction.reply(`Max number is ${maxNum}`);
        break;
      case "ping":
        interaction.reply("pong");
        break;
      case "fanart":
        fetch("https://gi-img-api.ak-team.repl.co/api/genshin/character")
          .then((res) => res.json())
          .then((res) => {
            interaction.reply({ content: "Fanart", files: [res.url] });
          });
        break;
      case "cosplay":
        fetch("https://gi-img-api.ak-team.repl.co/api/genshin/cosplay")
          .then((res) => res.json())
          .then((res) => {
            interaction.reply({ content: "Cosplay", files: [res.url] });
          });
        break;
      default:
        break;
    }
  }
});

async function main() {
  const commands = [
    {
      name: "ping",
      description: "ping it!",
      options: [
        { name: "food", description: "lalala", type: 3, required: true },
      ],
    },
    {
      name: "max",
      description: "finds max number",
      options: [
        { name: "num1", description: "first number", type: 3, required: true },
        { name: "num2", description: "second number", type: 3, required: true },
        { name: "num3", description: "third number", type: 3, required: true },
      ],
    },
    {
      name: "fanart",
      description: "sends a random genshin fanart🎨",
    },
    {
      name: "cosplay",
      description: "sends a random genshin cosplay👗",
    },
  ];
  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    client.login(TOKEN);
  } catch (error) {
    console.log(error);
  }
}
main();
