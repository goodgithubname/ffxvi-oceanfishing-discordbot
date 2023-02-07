const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

module.exports = (client) => {
  client.handleCommands = async () => {
    const path = require("path");
    const commandPath = path.resolve(__dirname, "../..");

    const commandFolders = fs.readdirSync(
      path.resolve(commandPath, "./commands")
    );

    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(path.resolve(commandPath, `./commands/${folder}`))
        .filter((file) => file.endsWith(".js"));

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        if ('data' in command && 'execute' in command) {
          commands.set(command.data.name, command);
          commandArray.push(command.data.toJSON());
          console.log(
            `Command: ${command.data.name} has been passed thourgh the handler`
          );
        } else {
          console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }

      }
    }

    const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN);

    for (var i = 0; i < client.commandArray; i++) {
      console.log(client.commandArray[i]);
    }

    try {
      console.log("Started refreshing application (/) commands.");
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: client.commandArray
      });
      console.log("sucessfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  };
};
