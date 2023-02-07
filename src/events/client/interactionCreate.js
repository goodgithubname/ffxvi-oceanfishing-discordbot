module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return
      };
      try {
        await command.execute(interaction, client);
      } catch (error) {
        await interaction.reply({
          content: "Something went wrong while executing this command...",
          ephemeral: true,
        });
      }
    }
  },
};
