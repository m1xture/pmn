import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { config } from "dotenv";
import {
  Client,
  GatewayIntentBits,
  Guild,
  Routes,
  EmbedBuilder,
  AttachmentBuilder,
  Embed,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { commands } from "./commands.js";

// import dataChar from "./data/characters.json" assert { type: "json" };
let dataChar;
const fs = require("fs");

const Jimp = require("jimp");

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
            const fanartEmbed = new EmbedBuilder()
              .setTitle("Random Genshin fanart")
              .setImage(res.url)
              .setColor("#8bd3dd");
            await interaction.deferReply();
            await wait(4000);
            await interaction.editReply({
              ephemeral: true,
              embeds: [fanartEmbed],
            });
          })
          .catch(async (err) => {
            const fanErrEmbed = new EmbedBuilder()
              .setTitle("Strange error occured <3")
              .setDescription(`API error. Try again\n${err}`)
              .setColor("#e53170");
            await interaction.deferReply();
            await wait(4000);
            await interaction.editReply({
              ephemeral: true,
              embeds: [fanErrEmbed],
            });
          });

        break;
      case "cosplay":
        fetch("https://gi-img-api.ak-team.repl.co/api/genshin/cosplay")
          .then((res) => res.json())
          .then(async (res) => {
            const cosplayEmbed = new EmbedBuilder()
              .setTitle("Random Genshin cosplay")
              .setImage(res.url)
              .setColor("#8bd3dd");
            await interaction.deferReply();
            await wait(4000);
            await interaction.editReply({
              ephemeral: true,
              embeds: [cosplayEmbed],
            });
          })
          .catch(async (err) => {
            const cosErrEmbed = new EmbedBuilder()
              .setTitle("Strange error occured <3")
              .setDescription(`API error. Try again\n${err}`)
              .setColor("#e53170");
            await interaction.deferReply();
            await wait(4000);
            await interaction.editReply({
              ephemeral: true,
              embeds: [cosErrEmbed],
            });
          });

        break;
      case "enka":
        if (
          interaction.options.getString("uid").length <= 9 &&
          !isNaN(interaction.options.getString("uid"))
        ) {
          fetch(
            "https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/characters.json"
          )
            .then((res) => res.json())
            .then((resp) => {
              dataChar = resp;
            });
          fetch(
            `https://enka.network/api/uid/${interaction.options.getString(
              "uid"
            )}/`
          )
            .then((res) => res.json())
            .then(async (res) => {
              const charactersFilesArray =
                res.playerInfo.showAvatarInfoList.map(
                  (char) =>
                    `https://enka.network/ui/${dataChar[
                      char.avatarId
                    ].SideIconName.replace("_Side", "")}.png`
                );
              const loadImages = Promise.all(
                charactersFilesArray.map((path) => Jimp.read(path))
              );
              let combinedImage = 0;
              loadImages
                .then((images) => {
                  combinedImage = new Jimp(
                    images[0].bitmap.width * images.length,
                    images[0].bitmap.height
                  );
                  images.forEach((image, index) => {
                    combinedImage.blit(image, index * image.bitmap.width, 0);
                  });

                  return combinedImage.writeAsync("./src/group.png");
                })
                .then(async () => {
                  Jimp.read("./src/group.png", async (err, img) => {
                    if (err) throw err;
                    img.write("./src/group.png", (error) => {
                      if (error) {
                        console.log(error);
                        return;
                      }
                    });
                  });

                  //?

                  // const url =
                  //   "https://web-production-32d8.up.railway.app/api/profile";

                  // // Parameters for the fetch request
                  // const requestOptions = {
                  //   method: "POST",
                  //   headers: {
                  //     "Content-Type": "application/json",
                  //   },
                  //   body: JSON.stringify({
                  //     uid: 750354959,
                  //     teample: 1,
                  //   }), // Assuming 757562748 is your UID
                  // };

                  // // Fetching data
                  // fetch(url, requestOptions)
                  //   .then((response) => {
                  //     if (!response.ok) {
                  //       throw new Error(
                  //         `HTTP error! Status: ${response.status}`
                  //       );
                  //     }
                  //     return response.json();
                  //   })
                  //   .then((data) => {
                  //     console.log(data);
                  //   })
                  //   .catch((error) => {
                  //     console.error("Error during fetch:", error);
                  //   });

                  //?

                  const enkaEmbed = new EmbedBuilder()
                    .setColor("#8bd3dd")
                    .setTitle(`${res.playerInfo.nickname}'s Genshin profile`)
                    .setDescription(
                      `Rank: ${res.playerInfo.level}\nFinished Achievements: ${res.playerInfo.finishAchievementNum}\nAbyss: ${res.playerInfo.towerFloorIndex} floor, ${res.playerInfo.towerLevelIndex} level\n\n**Showed characters:**`
                    )
                    .setImage("attachment://group.png")
                    .setFooter({
                      text: `${interaction.options.getString("uid")}`,
                    });
                  //? attachment://src/group.jpg
                  // console.log(enkaEmbed);
                  await interaction.deferReply();
                  await wait(5000);
                  await interaction.editReply({
                    ephemeral: true,
                    embeds: [enkaEmbed],
                    files: [
                      {
                        attachment: "./src/group.png",
                        name: "group.png",
                      },
                    ],
                  });
                });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          const errorEmbed = new EmbedBuilder()
            .setTitle("Error <3")
            .setDescription("Probably, you have typed an invalid UID")
            .setColor("#e53170")
            .setTimestamp();
          async function errorOccured() {
            await interaction.deferReply();
            await wait(4000);
            await interaction.editReply({
              ephemeral: true,
              embeds: [errorEmbed],
            });
          }
          errorOccured();
        }
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
