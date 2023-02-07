require("dotenv").config();

const TOKEN = process.env.BOT_TOKEN;
const {
  Client,
  Collection,
  GatewayIntentBits,
  TextChannel,
  EmbedBuilder
} = require("discord.js");

const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});



client.commands = new Collection();
client.commandArray = [];

const path = require("path");

const functionFolders = fs.readdirSync(path.resolve(__dirname, "./functions"));

for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(path.resolve(__dirname, `./functions/${folder}`))
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(path.resolve(__dirname, `./functions/${folder}/${file}`))(client);
}

client.handleEvents();
client.handleCommands();
client.login(TOKEN);



//Ocean Fishing Timer
const cron = require("node-cron");
require("./js_functions/customTime.js");
const getRoute = require("./js_functions/getRoute.js");

//remind users every odd hours
cron.schedule("0 1-23/2 * * *", () => {
  console.log("Posting Fishing Schedule");

  var status = "";
  const date = new Date();

  var hour;
  if (date.getHours() % 2 == 0) {
    if (date.getMinutes() == 1) {
      status = "In 1 minute";
    } else {
      var timeLeft = 60 - date.getMinutes();
      status = `In ${timeLeft} minutes`
    }
    hour = date.addHours(1).setZero().toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } else {
    if (date.getMinutes() <= 50) {
      status = "En route"
    }
    if (date.getMinutes() <= 20) {
      status = "Boarding";
    }
    hour = date.setZero().toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  const fishing_pass = getRoute(date);

  var imageURL = "";

  switch (fishing_pass[1]) {
    case "Day":
      imageURL = "https://cdn.upload.systems/uploads/WvAhcL9l.png";
      break;
    case "Sunset":
      imageURL = "https://cdn.upload.systems/uploads/WwMMgRlO.png";
      break;
    case "Night":
      imageURL = "https://cdn.upload.systems/uploads/D2ackCtz.png";
      break;
    default:
      break;
  }

  const Fishembed = new EmbedBuilder()
    .setColor('FFFF00')
    .setTitle(hour)
    .setDescription(status)
    .setThumbnail("https://garlandtools.org/files/icons/job//FSH.png")
    .addFields(
      { name: 'Route', value: fishing_pass[0] }
    )
    .addFields(
      { name: 'Arrival Time', value: fishing_pass[1] }
    )
    .setImage(imageURL);

  const channel = client.channels.cache.get(process.env.FISHING_CHANNEL_ID);
  channel.send({ embeds: [Fishembed] })
    .then(msg => {
      setTimeout(() => msg.delete(), 300000)
    })
    .catch(console.error);
});
