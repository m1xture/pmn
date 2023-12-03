import { Client, GatewayIntentBits, Guild, Routes } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

const orderCommand = new SlashCommandBuilder()
  .setName("order")
  .setDescription("order mthj")
  .addStringOption((option) =>
    option
      .setName("food")
      .setDescription("choose a meal")
      .setRequired(true)
      .setChoices(
        { name: "Pizza", value: "pizza" },
        { name: "Delicious soup", value: "soup" }
      )
  )
  .addStringOption((option) =>
    option
      .setName("drink")
      .setDescription("chooser a drink")
      .setRequired(false)
      .setChoices(
        { name: "fanta", value: "true fanta" },
        { name: "water", value: "true weater" }
      )
  );
const fanartCommand = new SlashCommandBuilder()
  .setName("fanart")
  .setDescription("sends a random genshin fanart🎨");
const cosplayCommand = new SlashCommandBuilder()
  .setName("cosplay")
  .setDescription("sends a random genshin cosplay👗");

const enkaCommand = new SlashCommandBuilder()
  .setName("enka")
  .setDescription("something like enka.network")
  .addStringOption((option) =>
    option.setName("uid").setDescription("your UID").setRequired(true)
  );

export const commands = [
  orderCommand.toJSON(),
  fanartCommand.toJSON(),
  cosplayCommand.toJSON(),
  enkaCommand.toJSON(),
];
