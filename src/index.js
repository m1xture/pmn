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
  TextInputBuilder,
  TextInputStyle,
  InteractionType,
} from "discord.js";
import {
  ActionRowBuilder,
  ModalBuilder,
  SelectMenuBuilder,
  SlashCommandBuilder,
} from "@discordjs/builders";
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
    // console.log(interaction.getSubcommandName());
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
      case "dungeons":
        const daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const dungDate = new Date();

        const dungeonEmbed = new EmbedBuilder()
          .setColor("#8bd3dd")
          .setTitle(daysOfWeek[dungDate.getDay()])
          .setDescription("Today`s schedule");
        interaction.reply({
          embeds: [dungeonEmbed],
        });
        switch (daysOfWeek[dungDate.getDay()]) {
          case "Sunday":
            break;
          case "Monday":
            break;
          case "Tuesday":
            break;
          case "Wednesday":
            break;
          case "Thursday":
            break;
          case "Friday":
            break;
          case "Saturday":
            break;
          default:
            break;
        }
        break;
      case "order":
        const actionRowComponent = new ActionRowBuilder().setComponents(
          new SelectMenuBuilder().setCustomId("food_options").setOptions([
            { label: "Cake", value: "cake" },
            { label: "Pasta", value: "pasta" },
            { label: "Sushi", value: "sushi" },
          ])
        );
        const actionRowDrinks = new ActionRowBuilder().setComponents(
          new SelectMenuBuilder().setCustomId("drink_options").setOptions([
            { label: "Cola", value: "cola" },
            { label: "Fanta", value: "fanta" },
          ])
        );
        interaction.reply({
          components: [actionRowComponent.toJSON(), actionRowDrinks.toJSON()],
        });
        break;
      case "register":
        const modal = new ModalBuilder()
          .setTitle("Register user form")
          .setCustomId("registerUserModal")
          .setComponents(
            new ActionRowBuilder().setComponents(
              new TextInputBuilder()
                .setLabel("username")
                .setCustomId("username")
                .setStyle(TextInputStyle.Short)
            ),
            new ActionRowBuilder().setComponents(
              new TextInputBuilder()
                .setLabel("email")
                .setCustomId("email")
                .setStyle(TextInputStyle.Short)
            ),
            new ActionRowBuilder().setComponents(
              new TextInputBuilder()
                .setLabel("comment")
                .setCustomId("comment")
                .setStyle(TextInputStyle.Paragraph)
            )
          );
        interaction.showModal(modal);
        break;
      case "heads_or_tails":
        interaction.reply({
          content: "The coin is dropping...",
        });
        const droppedValue = ["Heads", "Tails"][
          Math.round(Math.random() * 1 - 0)
        ];
        // console.log(droppedValue);
        let emoji = ":full_moon:";
        if (droppedValue === "Tails") {
          emoji = ":new_moon:";
        }
        interaction.channel.send(`${droppedValue} dropped!${emoji}`);
        // console.log(interaction.options.getString("your_value"));
        if (interaction.options.getString("your_value") !== null) {
          if (
            interaction.options.getString("your_value").toLowerCase() ===
            droppedValue.toLowerCase()
          ) {
            interaction.channel.send("You won!");
          } else {
            interaction.channel.send("You lose! Baka");
          }
        }
        break;
      case "clear":
        if (isNaN(Number(interaction.options.getString("num"))) && interaction.options.getString("num") !== "all") {
          return interaction.reply({
            content: "Enter __a number__ into the first parameter",
          });
        }
        if (!interaction.options.getString("user")) {
          async function deleteMessages() {
            await interaction.channel.messages
              .fetch({
                limit: Number(interaction.options.getString("num")),
              })
              .then(async (msgs) => {
                interaction.channel.bulkDelete(msgs);
                interaction.reply({
                  content: `${interaction.options.getString(
                    "num"
                  )} messages deleted. And this message'll delete after 5s.`,
                });
                const replyMessage = await interaction.fetchReply();
                setTimeout(() => replyMessage.delete(), 5000);
              });
          }
          deleteMessages();
        } else {
          if (interaction.options.getString("num") === "all") {

            return;
          }
          
        }
        break;
      default:
        break;
    }
  } else if (interaction.isSelectMenu()) {
    console.log(interaction);

    interaction.reply({ content: "hwello" });
    if (interaction.customId === "food_options") {
      interaction.delete;
      interaction.channel.send("lala");
    } else if (interaction.customId === "drink_options") {
    }
  } else if (interaction.type === InteractionType.ModalSubmit) {
    console.log("modal submitted...");
    if (interaction.customId === "registerUserModal") {
      const username = interaction.fields.getTextInputValue("username");
      interaction.reply({ content: ` has successfully submitted the form` });
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
