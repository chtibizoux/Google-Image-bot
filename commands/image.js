import { Message, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("image")
  .setDescription("Obtenez une image de Google")
  .addStringOption((option) => option.setName("search").setDescription("La recherche").setRequired(true));

/**
 * @param {Message} message
 */
export async function fromMessage(message) {
  const search = message.content.slice(7);
  const reply = await execute(search, message.client.bannedSearch, message.guild.id);
  await message.channel.send(reply);
}

/**
 * @param {import("discord.js").Interaction} interaction
 */
export async function fromInteraction(interaction) {
  const search = interaction.options.getString("search");
  const reply = await execute(search, interaction.client.bannedSearch, interaction.guild.id);
  await interaction.reply(reply);
}

async function execute(search, bannedSearch, guildId) {
  if (guildId in bannedSearch) {
    if (bannedSearch[guildId].includes(search)) {
      return "Désoler cette recherche à été bloquer sur ce serveur";
    }
  }

  const encodedSearch = encodeURIComponent(search);

  const res = await fetch("https://api.qwant.com/v3/search/images?count=1&q=" + encodedSearch + "&t=" + encodedSearch + "&f=&offset=0&locale=fr_fr&uiv=4");
  const data = await res.json();

  return data.data.result.items[0].media;
}
