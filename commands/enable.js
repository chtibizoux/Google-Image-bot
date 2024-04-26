import { Message, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("enable")
  .setDescription("Annuler l'interdiction d'une recherche sur ce serveur")
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
    if (!bannedSearch[guildId].includes(search)) {
      return "Erreur vous n'avez pas supprimer la recherche `" + search + "`";
    }
    bannedSearch[guildId].splice(bannedSearch[guildId].indexOf(search), 1);
  } else {
    return "Erreur vous n'avez supprimer aucune recherche";
  }
  saveBannedSearch();
  return "Mot clé `" + search + "` restaurer avec succès";
}
