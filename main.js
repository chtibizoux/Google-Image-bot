const fs = require("fs");
const cheerio = require('cheerio');
const request = require('request');
const discord = require("discord.js");

const bot = new discord.Client();
if (!fs.existsSync("config.json")) {
    console.error("Please create config.json file config.json.exemple is an exemple");
}
var config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
var guilds = JSON.parse(fs.readFileSync("./guilds.json", "utf8"));

bot.on('ready', () => {
  console.log("This Bot is online!");
  bot.user.setActivity("type §help");
});

bot.on("message", (message) => {
    if (message.content.startsWith("§")) {
        if (message.content.startsWith("§help")) {
          message.channel.send("`§image` Envoyer la première image quand on recherche *image* sur google\n`§disable image` suprimer la recherche *image*\n`§enable image` remettre accesible la recherche *image*");
        }else if (message.content.startsWith("§enable")) {
          enable(message);
        }else if (message.content.startsWith("§disable")) {
          disable(message);
        }else {
          image(message);
        }
    }
});

function disable(message) {
    var search = message.content.slice(9);
    if (message.guild.id in guilds) {
        if (guilds[message.guild.id].includes(search)) {
            message.channel.send("Erreur la recherche  `" + search + "` a déjà été supprimer");
        }else {
            guilds[message.guild.id].push(search);
        }
    }else {
        guilds[message.guild.id] = [search];
    }
    fs.writeFileSync('./guilds.json', JSON.stringify(guilds));
}

function enable(message) {
    var search = message.content.slice(8);
    if (message.guild.id in guilds) {
        if (guilds[message.guild.id].includes(search)) {
            guilds[message.guild.id].splice(guilds[message.guild.id].indexOf(search), 1);
        }else {
            message.channel.send("Erreur vous n'avez pas supprimer la recherche `" + search + "`");
        }
    }else {
        message.channel.send("Erreur vous n'avez supprimer aucune recherche");
    }
    fs.writeFileSync('./guilds.json', JSON.stringify(guilds));
}

function image(message) {
    var search = message.content.slice(1);
    if (message.guild.id in guilds) {
        if (guilds[message.guild.id].includes(search)) {
            message.channel.send("Désoler cette recherche à été bloquer sur ce serveur");
            return;
        }
    }
    var options = {
        url: "https://results.dogpile.com/serp?qc=images&q=" + search,
        method: "GET",
        headers: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
        }
    };
    request(options, function(error, response, responseBody) {
        if (error) return;
        $ = cheerio.load(responseBody);
        var links = $(".image a.link");
        var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
        if (!urls.length) {
            return;
        }
        message.channel.send(urls[0]);
    });
}

bot.login(config.token);
