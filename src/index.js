import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { config } from "dotenv";
import { Client, GatewayIntentBits, Guild, Routes } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { commands } from "./commands.js";

import dataChar from "./data/characters.json" assert { type: "json" };
const wait = require("node:timers/promises").setTimeout;

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
      case "fanart":
        fetch("https://gi-img-api.ak-team.repl.co/api/genshin/character")
          .then((res) => res.json())
          .then(async (res) => {
            await interaction.deferReply();
            await wait(4000);
            await interaction.editReply({
              content: "Fanart",
              ephemeral: true,
              files: [res.url],
            });
          });
        break;
      case "cosplay":
        fetch("https://gi-img-api.ak-team.repl.co/api/genshin/cosplay")
          .then((res) => res.json())
          .then(async (res) => {
            await interaction.deferReply();
            await wait(4000);
            await interaction.editReply({
              content: "Cosplay",
              ephemeral: true,
              files: [res.url],
            });
          });

        break;
      case "enka":
        fetch(
          `https://enka.network/api/uid/${interaction.options.getString(
            "uid"
          )}/`
        )
          .then((res) => res.json())
          .then(async (res) => {
            // console.log(res.playerInfo.showAvatarInfoList[0].avatarID);
            // const fileAvatar = `https://enka.network/ui/${
            //   dataChar[res.playerInfo.showAvatarInfoList[0].avatarID]
            //     .SideIconName
            // }.png`;
            await interaction.deferReply();
            await wait(4000);
            await interaction.editReply({
              content:
                res.playerInfo.nickname +
                " " +
                res.playerInfo.signature +
                " " +
                res.playerInfo.showAvatarInfoList[0].avatarId,
              ephemeral: true,
              files: [
                `https://enka.network/ui/${dataChar[
                  res.playerInfo.showAvatarInfoList[0].avatarId
                ].SideIconName.replace("_Side", "")}.png`,
              ],
            });
            // console.log(res.playerInfo.showAvatarInfoList[0][1]);
          });
        break;
      case "order":
        interaction.reply(`You ordered`);
        break;
      default:
        break;
    }
  }
});

async function main() {
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
