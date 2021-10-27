const fs = require("fs");
// const cheerio = require('cheerio');
const https = require('https')
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
    var search = encodeURIComponent(message.content.slice(1));
    if (message.guild.id in guilds) {
        if (guilds[message.guild.id].includes(search)) {
            message.channel.send("Désoler cette recherche à été bloquer sur ce serveur");
            return;
        }
    }
    const options = {
        hostname: 'api.qwant.com',
        path: '/v3/search/images?count=1&q=' + search + '&t=' + search + '&f=&offset=0&locale=fr_fr&uiv=4',
        headers: {
            'User-Agent': "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:56.0) Gecko/20100101 Firefox/56.0"
        }
    };
    var data = "";
    https.get(options, res => {
        res.on('data', chunk => {
            data += chunk;
        });
        res.on('end', () => {
            var jsonData = JSON.parse(data);
            message.channel.send(jsonData.data.result.items[0].media);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
    // https.get("https://www.google.com/search?q=" + search + "&tbm=isch", res => {
    //     res.on('data', chunk => {
    //         data += chunk;
    //     });
    //     res.on('end', () => {
    //         console.log(data);
    //         $ = cheerio.load(data);
    //         var links = $(".t0fcAb");
    //         var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("src"));
    //         if (!urls.length) {
    //             return;
    //         }
    //         message.channel.send(urls[0]);
    //     });
    // }).on("error", (err) => {
    //     console.log("Error: " + err.message);
    // });
}
bot.login(config.token);