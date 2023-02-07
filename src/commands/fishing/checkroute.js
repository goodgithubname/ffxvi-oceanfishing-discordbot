const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const getRoute = require("../../js_functions/getRoute.js");

require("../../js_functions/getRoute.js");
require("../../js_functions/customTime.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("checkroute")
    .setDescription("Get the current ocean fishing route."),
  async execute(interaction, client) {
    console.log("checkroute command");

    var status = "";
    const date = new Date();

    //calculate time until next voyage
    var hour;
    if (date.getHours() % 2 == 0) {
      if (date.getMinutes() == 1) {
        status = "In 1 minute";
      } else {
        var timeLeft = 60 - date.getMinutes();
        status = `In ${timeLeft} minutes`;
      }
      hour = date.addHours(1).setZero().toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else {
      if (date.getMinutes() <= 35) {
        status = "En route";
      }
      if (date.getMinutes() <= 20) {
        status = "Boarding";
      }
      hour = date.setZero().toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    console.log(hour);
    const fishing_pass = getRoute(date);
    var imageURL = "";

    //images for day, sunset and night for embed visuals
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
    //creating embed message
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

    //reply's ephemeral set to true to only be visible to the user that initiated the command
    await interaction.reply({
      embeds: [Fishembed],
      ephemeral: true
    })
      .then(console.log('embed sent to user'))
      .catch(console.error);
  },
};
