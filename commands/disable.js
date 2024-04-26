import { Message, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("disable")
  .setDescription("Interdire une recherche sur ce serveur")
  .addStringOption((option) => option.setName("search").setDescription("La recherche").setRequired(true));

/**
 * @param {Message} message
 */
export async function fromMessage(message) {
  const search = message.content.slice(7);
  const reply = await execute(search, message.client, message.guild.id);
  await message.channel.send(reply);
}

/**
 * @param {import("discord.js").Interaction} interaction
 */
export async function fromInteraction(interaction) {
  const search = interaction.options.getString("search");
  const reply = await execute(search, interaction.client, interaction.guild.id);
  await interaction.reply(reply);
}

async function execute(search, { bannedSearch, saveBannedSearch }, guildId) {
  if (guildId in bannedSearch) {
    if (bannedSearch[guildId].includes(search)) {
      return "Erreur la recherche  `" + search + "` a déjà été supprimer";
    }

    bannedSearch[guildId].push(search);
  } else {
    bannedSearch[guildId] = [search];
  }
  saveBannedSearch();
  return "Mot clé `" + search + "` supprimer avec succès";
}
