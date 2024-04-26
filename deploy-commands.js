import { REST, Routes } from "discord.js";
import fs from "fs";

const commands = [];

const commandsPath = "./commands";
const commandFiles = fs.readdirSync(commandsPath);

for (const file of commandFiles) {
  const filePath = commandsPath + "/" + file;
  const command = await import(filePath);
  if ("data" in command) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

const rest = new REST().setToken(process.env.TOKEN);

try {
  console.log(`Started refreshing ${commands.length} application (/) commands.`);

  // The put method is used to fully refresh all commands in the guild with the current set
  const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

  console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
  // And of course, make sure you catch and log any errors!
  console.error(error);
}
