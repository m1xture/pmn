import { Client, GatewayIntentBits, Guild, Routes } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

const orderCommand = new SlashCommandBuilder()
  .setName("order")
  .setDescription("order mthj");
// .addStringOption((option) =>
//   option
//     .setName("food")
//     .setDescription("choose a meal")
//     .setRequired(true)
//     .setChoices(
//       { name: "Pizza", value: "pizza" },
//       { name: "Delicious soup", value: "soup" }
//     )
// )
// .addStringOption((option) =>
//   option
//     .setName("drink")
//     .setDescription("chooser a drink")
//     .setRequired(false)
//     .setChoices(
//       { name: "fanta", value: "true fanta" },
//       { name: "water", value: "true weater" }
//     )
// );
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
const dungeonsCommand = new SlashCommandBuilder()
  .setName("dungeons")
  .setDescription("gives todays`s dungeons schedule");

// const banCommand = new SlashCommandBuilder()
//   .setName("ban")
//   .setDescription("Bans a user")
//   .addSubcommandGroup((group) =>
//     group
//       .setName("group_a")
//       .setDescription("group_a")
//       .addSubcommand((subcommand) =>
//         subcommand
//           .setName("temp")
//           .setDescription("temporary bans a user")
//           .addUserOption((option) =>
//             option.setName("user").setDescription("user to be banned")
//           )
//       )
//       .addSubcommand((subcommand) =>
//         subcommand
//           .setName("perma")
//           .setDescription("perm bans a user")
//           .addUserOption((option) =>
//             option.setName("user").setDescription("user to be banned")
//           )
//       )
//   )
//  .addSubcommand((group) =>
//   group
//     .setName("b")
//     .setDescription("group_b")
//     .addSubcommand((subcommand) =>
//       subcommand.setName("soft").setDescription("soft ban")
//     )
// );

const registerCommand = new SlashCommandBuilder()
  .setName("register")
  .setDescription("Register a user to the serber officially");

const hotCommand = new SlashCommandBuilder()
  .setName("heads_or_tails")
  .setDescription("What will drop? Heads or tails??")
  .addStringOption((option) =>
    option
      .setName("your_value")
      .setDescription("choose your option")
      .setRequired(false)
      .setChoices(
        { name: "Heads", value: "heads" },
        { name: "Tails", value: "tails" }
      )
  );

export const commands = [
  orderCommand.toJSON(),
  fanartCommand.toJSON(),
  cosplayCommand.toJSON(),
  enkaCommand.toJSON(),
  dungeonsCommand.toJSON(),
  // banCommand.toJSON(),
  registerCommand.toJSON(),
  hotCommand.toJSON(),
];
