import colors from "colors";
import DB from "./util/mongo";
import mongoose from "mongoose";
import Server from "./server";
import logger from "./log";
import CommandH from "./util/commands";
import fs from "fs";
import * as Typings from "./client";
import Discord from "discord.js";
import Fetch from "node-fetch";
import { Shadow } from "./client";
import { GiveawaysManager } from "discord-giveaways";
import express from "express";
let app = express();
app.all("/", (_: any, res: any) =>
  res.json({ status: 200, message: _.headers })
);
// Using Node.js `require()`
//while(true) console.log(require.cache[require.resolve('./server.js')], require.cache[require.resolve('../server.js')])
const checkconfig = () => {
  return Server;
};

// e
// const util = require('./util')
// let shadow = require('./util/Client')
//@ts-ignore
let client: Shadow = new Discord.Client({
  intents: 30463,
  allowedMentions: { parse: ["users", "roles"], repliedUser: false },
  partials: ["CHANNEL"],
  ws: { properties: { $browser: "Discord Android" } },
});
//let client = new shadow({ intents: [ 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'DIRECT_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_REACTIONS', 'GUILDS', 'DIRECT_MESSAGE_TYPING', 'GUILD_INVITES', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_INTEGRATIONS'], allowedMentions: { parse: ['users'], repliedUser: true }  })
// require('discord-buttons')(client);
let { token, prefix, mongo } = Server;

var connection = mongoose.connect(mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const DbConnectionWait = (): Promise<void> => {
  return new Promise((res: Function) => {
    connection.then(() => res());
  });
};
//mongoose.createConnection(mongo/*, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true,
// }
//*/);

connection.then(() => {
  client?.error ? client.error("connected") : null;
  for (var i = 0; i !== 15; i++) {
    console.log("connected mongo");
  }
  // client.db.all().then((d:any) => {
  //   d.forEach((data:any) => {
  //     if(data.key.startsWith('error_')) data.remove()
  //   });
  // })
});

DbConnectionWait().then(() => {
  client.login(token);
});
let db = new DB();
// db.get("ping").then(console.log)
// {
//   reciver: false,
//   username: 'SH@D0Wb0T',
//  password: '$h@d0.wB0t.$',
//   uri: 'https://DB-LMAO.nongmerbot.repl.co'
//}
//console.log(db);
/**
 * @instance
 */
client.debug = [];
client.util = require("./util").default;
client.Util = require("discord.js").Util;
client.slash_commands = new Discord.Collection();
client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.awaited_commands = new Discord.Collection();
client.aliases = new Discord.Collection();
/**
 * @returns {DB}
 * @name Db
 */
client.db = db;
/**
 * @name ExpressApp
 * @NeonGamerBot-QK
 * @module
 */
client.expressApp = app;
client.dab = db;
client.cache = [];
/**
 * @returns {CommandH}
 */
//@ts-ignore
client.commandsM = new CommandH({
  path: __dirname + "/commands/",
  //@ts-ignore
  client: client,
});

client.catagory = [
  { name: "basic", emoji: "894959651270033410" },
  { name: "music" },
];
client.queue = new Map();
client.vars = {};
client.storage = {};
/**
 * @returns {Object}
 * @name packager file
 */
client.package = require("./package.json");
/**
 * @returns {Array}
 */
client.files = fs.readdirSync("./");
client.config = checkconfig();
client.storage.fetched = { channels: {} };
client.errorCount = 0;
setTimeout(() => client.on("warn", client.logger.warn), 6e6);
client.fetch = Fetch;
// @ts-ignore
// class giveaways extends GiveawaysManager {
//   constructor(client:any, ops:any) {
// super(client,ops)
//   }
//   // This function is called when the manager needs to get all giveaways which are stored in the database.
//   async getAllGiveaways() {
//     // Get all giveaways from the database
//     return await db.get("giveaways");
//   }

//   // This function is called when a giveaway needs to be saved in the database.
//   async saveGiveaway(messageID:any, giveawayData:any) {
//     // Add the new giveaway to the database
//     const ar = (await db.get("giveaways")) || [];
//     ar.push(giveawayData), db.set("giveaways", ar);
//     // Don't forget to return something!
//     return true;
//   }

//   // This function is called when a giveaway needs to be edited in the database.
//   async editGiveaway(messageID:any, giveawayData:any) {
//     // Get all giveaways from the database
//     const giveaways = await db.get("giveaways");
//     // Remove the unedited giveaway from the array
//     const newGiveawaysArray = giveaways.filter(
//       (giveaway:any) => giveaway.messageID !== messageID
//     );
//     // Push the edited giveaway into the array
//     newGiveawaysArray.push(giveawayData);
//     // Save the updated array
//     await db.set("giveaways", newGiveawaysArray);
//     // Don't forget to return something!
//     return true;
//   }

//   // This function is called when a giveaway needs to be deleted from the database.
//   async deleteGiveaway(messageID:any) {
//     // Get all giveaways from the database
//     const giveaways = await db.get("giveaways");
//     // Remove the giveaway from the array
//     const newGiveawaysArray = giveaways.filter(
//       (giveaway:any) => giveaway.messageID !== messageID
//     );
//     // Save the updated array
//     await db.set("giveaways", newGiveawaysArray);
//     // Don't forget to return something!
//   }
// }
setTimeout(
  () => db.on("debug", (info: String) => client.logger?.debug(info)),
  3e4
);
// client.giveaways = new giveaways(client, {
//   storage: "./giveaways.json",
//   updateCountdownEvery: 10000,
//   hasGuildMembersIntent: true,
//   default: {
//     botsCanWin: false,
//     exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
//     embedColor: "#FF0000",
//     embedColorEnd: "#000000",
//     reaction: "🎉",
//   },
// });

// client.getapi = async function (endpoint:any, prams:any) {
//   if (!endpoint) return;
//   let type;
//   let params = prams;
//   if (!type) {
//     type = 0;
//   }

//   if (typeof prams !== "object") {
//     if (typeof prams == "undefined") {
//       prams = null;
//     } else {
//       prams = JSON.stringify(prams);
//     }
//   }
//   let result;
//   const query = Object.keys(params)
//     .map((k) => `${esc(k)}=${esc(params[k])}`)
//     .join("&");
//   if ((type = 0)) {
//     require("node-fetch")(
//       "https://apiv2.jastinch.xyz/" +
//         endpoint +
//         "?key=" +
//         client.config.api_key[0] +
//         query,
//       {
//         method: "GET",
//       }
//     )
//       .then((res:any) => res.text())
//       .then((j:any) => (result = j));
//     return await result;
//   }
// };
/**
 *
 * @param {String||Number} reason
 */
client.shutdown = async function (reason = "None provided") {
  const descc =
    typeof reason === "number"
      ? `Exiting with code ` + reason
      : reason || "None provided";
  let desc = `\n reason: \`\`\`bash\n${descc}\`\`\``;
  try {
    /**
     * @returns {Discord.NewsChannel}
     * @implements {Discord.NewsChannel}
     */
    const ch = client.channels.cache.get(
      "832694631459192903"
    ) as Discord.NewsChannel;
    await ch
      ?.send({
        content: "<@&882669704102150225>",
        embeds: [
          new Discord.MessageEmbed()
            .setTitle("Shutting down")
            .setDescription(desc)
            .setColor("RED")
            .setTimestamp(),
        ],
      })
      .then((m: any) => m.crosspost());
    // db.close(1)
    //  await client.error('shuting down')
    await client.emit("debug", "[DEBUG] => ( Shutting down...)");
  } catch (e) {
    client.error ? client.error(e) : null;
    e = {};
  } finally {
    await (client.error ? client.error("finally down") : null);
    if (client.isReady()) client.destroy();
    setTimeout(
      () => process.exit(typeof reason === "number" ? reason : 1),
      500
    );
  }
};
/**
 *
 * @param {Error} error
 * @param {String} type
 * @returns {Void}
 * @name Error
 */
client.error = async function (error: any, type?: String) {
  if (!type) {
    type = "[UNHANDLED]";
  }
  try {
    if (typeof error !== "string") {
      error = require("util").inspect(error);
    }
    client.errorCount++;
    await client.db.set("errors", (await client.db.get("errors")) + 1);
    const embed = new Discord.MessageEmbed()
      .setTitle("Error")
      .setDescription("```bash\n" + error + "```")
      .setColor("#ff0000")
      .setFooter(
        `with in total of ${await client.db.get(
          "errors"
        )} and in this session error count of ${
          client.errorCount
        } type: ${type}`
      );
    const m = await (
      client.channels.cache.get("829753754713718816") as Discord.TextChannel
    ).send({ embeds: [embed] });
  } catch (e) {
    console.error(e);
    console.error(error);
  }
};
setInterval(() => {
  console.log(
    `Pong! ${client.ws.ping} && stuff`,
    require("discord.js").version,
    client.constructor.name,
    client.db?.ping
  );
}, 3000);
process.stdout.on("resize", () => process.stdout.write("resize"));
client.commandsM.loadthings();
//@ts-ignore
client.on(
  "interaction",
  /**
   * @name interaction
   */ async (interaction: Discord.CommandInteraction): Promise<any> => {
    console.log(interaction);
    if (!interaction.isCommand()) return;
    const subcommand = interaction.options.getSubcommand();
    const group = interaction.options.getSubcommandGroup();
    let cmd =
      !subcommand && !group
        ? interaction.commandName
        : !group
        ? subcommand
        : subcommand;
    const args: any[] = [];
    interaction.options.data.map((x: any) => {
      args.push(x.value);
    });
    const command = client.slash_commands.find((c: Typings.Command) => {
      if (c.category && c.category === interaction.commandName) {
        return c.name === cmd;
      } else {
        return c.name === cmd;
      }
    });
    const wait = require("util").promisify(setTimeout);

    if (!command)
      return interaction.reply({
        content: "cannot get command " + cmd,
        ephemeral: true,
      });

    try {
      await command.execute(interaction, cmd, args, client);
      if (!interaction.replied)
        interaction.reply({
          ephemeral: true,
          content: "This command does not reply UWU",
        });
    } catch (e) {
      client.error ? client.error(e) : null;
      interaction.reply({
        content: "faild to run this command!",
        ephemeral: true,
      });
    }
  }
);
//@ts-ignore
client.on(
  "interactionCreate",
  async (interaction: Discord.ContextMenuInteraction) => {
    if (!interaction.isContextMenu()) return;
    const execute = async () => {
      const target = await interaction.guild?.members.fetch(
        interaction.targetId
      );
      const Res = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(
          target?.user?.tag || "",
          target?.user?.displayAvatarURL({ dynamic: true, size: 512 }) || ""
        )
        .setThumbnail(
          target?.user?.displayAvatarURL({ dynamic: true, size: 512 }) || ""
        )
        .addField("ID", target?.user.id || "", true)
        .addField(
          `Roles`,
          `${
            target?.roles.cache
              .map((r: any) => r.toString())
              .join(" ")
              .replace(/@everyone/, " ") || "None"
          }`
        )
        .addField(
          "Member since",
          `<t:${parseInt(
            ((target?.joinedTimestamp || 0) / 1000).toString()
          )}:R>`,
          true
        )
        .addField(
          "User since",
          `<t:${parseInt(
            ((target?.user.createdTimestamp || 0) / 1000).toString()
          )}:R>`,
          true
        );
      interaction.reply({ embeds: [Res], ephemeral: true });
    };
    if (interaction.commandName === "userinfo") {
      try {
        await execute();
      } catch (e) {
        interaction.reply({
          content: "faild to run this command",
          ephemeral: true,
        });
      }
    } else {
      interaction.reply({ content: "Unkowen command!", ephemeral: true });
    }
  }
);

setTimeout(
  () => process.on("warning", (info: any) => client.logger?.warn(info)),
  6e6
);
process.on("uncaughtException", (err: any) => {
  console.error(err);
  client.error ? client.error(err) : null;
});
process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  client.error ? client.error(reason) : null;
});
process.on("SIGINT", () =>
  client.shutdown ? client?.shutdown("SIGINT") : null
);
process.on("exit", (code: any) =>
  client.shutdown ? client?.shutdown(`CODE ${code}`) : null
);
process.on("beforeExit", () => console.log("exiting..."));
process.on("SIGBREAK", () =>
  client.shutdown ? client?.shutdown("SIGBREAK") : null
);
process.on("SIGKILL", () =>
  client.shutdown ? client?.shutdown("SIGKILL") : null
);
process.on("SIGTERM", () =>
  client.shutdown ? client?.shutdown("SIGTERM") : null
);
process.on("SIGSTOP", () =>
  client.shutdown ? client?.shutdown("SIGSTOP") : null
);

process.on("SIGINFO", (info: any) => {
  console.log(info);
});
process.on("newListener", (listner) => {
  client.logger
    ? client.logger.log("Registered listner " + listner.toString())
    : process.stdout.write(listner.toString());
});
process.on("disconnect", () => {
  console.warn("Disconnect from wifi!");
  client.destroy();
  process.exit(0);
});
process.on("uncaughtExceptionMonitor", (err: any) => {
  client.error ? client.error(err) : console.error(err);
});
process.on("removeListener", (listner) => {
  client.logger
    ? client.logger.log("Removed listner " + listner.toString())
    : console.log("Listner %s was removed", listner.toString());
});
process.on("message", (message, cb) => {
  client.logger.log("Message " + message);
  console.log(message, cb);
});
process.stdin.on("data", (buff: Buffer) => {
  const str = buff.toString();
  client.logger.log(`User input found ${str}`);
});
process.setMaxListeners(0);
