const fs = require("fs");

module.exports = (client) => {
  client.handleEvents = async () => {
    const path = require("path");
    const eventdir = path.resolve(__dirname, "../..");

    console.log(path.resolve(eventdir, "./events"));

    const eventFolders = fs.readdirSync(path.resolve(eventdir, "./events"));
    for (const folder of eventFolders) {
      const eventFiles = fs
        .readdirSync(path.resolve(eventdir, `./events/${folder}`))
        .filter((file) => file.endsWith(".js"));

      switch (folder) {
        case "client":
          for (const file of eventFiles) {
            const event = require(`../../events/${folder}/${file}`);
            if (event.once)
              client.once(event.name, (...args) =>
                event.execute(...args, client)
              );
            else
              client.on(event.name, (...args) =>
                event.execute(...args, client)
              );
          }
          break;
        default:
          break;
      }
    }
  };
};
