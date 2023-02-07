const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Returns your ping."),
  async execute(interaction, client) {
    console.log("Sending ping!");

    const message = await interaction.deferReply({
      fetchReply: true,
    });

    //returns API latency and user latency
    const newMessage = `API Latency: ${client.ws.ping}\nClient Ping: ${message.createdTimestamp - interaction.createdTimestamp
      }`;

    await interaction.editReply({
      content: newMessage,
      ephemeral: true,
    });
  },
};
