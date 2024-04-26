import { Events, Message } from "discord.js";

export const name = Events.MessageCreate;

/**
 *
 * @param {Message} message
 * @returns
 */
export async function execute(message) {
  if (!message.content.startsWith("§")) {
    return;
  }

  const endIndex = message.content.indexOf(" ");
  const name = message.content.slice(1, endIndex > 0 ? endIndex : undefined);

  const command = message.client.commands.get(name);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.fromMessage(message);
  } catch (error) {
    console.error(error);
    await message.reply({ content: "There was an error while executing this command!", ephemeral: true });
  }
}
