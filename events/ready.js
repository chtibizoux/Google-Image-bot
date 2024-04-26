import { Client, Events } from "discord.js";

export const name = Events.ClientReady;
export const once = true;

/**
 *
 * @param {Client} client
 */
export function execute(client) {
  console.log("This Bot is online!");
  client.user.setActivity("$image");
}
