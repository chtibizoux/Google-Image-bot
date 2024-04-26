import { Client, Collection } from "discord.js";
import fs from "fs";

const client = new Client({ intents: [] });

// Register commands
client.commands = new Collection();

const commandsPath = "./commands";
const commandFiles = fs.readdirSync(commandsPath);

for (const file of commandFiles) {
  const filePath = commandsPath + "/" + file;
  const command = await import(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "fromInteraction" in command && "fromMessage" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

// Register events
const eventsPath = "./events";
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = eventsPath + "/" + file;
  const event = await import(filePath);
  if ("name" in event && "execute" in event) {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  } else {
    console.warn(`[WARNING] The event at ${filePath} is missing a required "name" or "execute" property.`);
  }
}

// Register banned search
if (!fs.existsSync("guilds.json")) {
  fs.writeFileSync("./guilds.json", "[]");
}

client.bannedSearch = JSON.parse(fs.readFileSync("./guilds.json", "utf8"));
client.saveBannedSearch = () => fs.writeFileSync("./guilds.json", JSON.stringify(client.bannedSearch));

client.login(process.env.TOKEN);
