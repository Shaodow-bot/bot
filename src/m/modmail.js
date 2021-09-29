let map = require("../models/modmail.js");
let {
  MessageEmbed,
  Message,
  Client,
  MessageAttachment,
  Guild,
  MessageActionRow,
  MessageButton,
  Interaction,
} = require("discord.js");
function getname(i) {
  const get_number = (ind) => {
    switch (ind) {
      case 1:
        return "one";
        break;
      case 2:
        return "two";
        break;
      case 3:
        return "three";
        break;
      case 4:
        return "four";
        break;
      case 5:
        return "five";
        break;
      case 6:
        return "six";
        break;
      case 7:
        return "seven";
        break;
      case 8:
        return "eight";
        break;
      case 9:
        return "nine";
        break;
      case 0:
        return "zero";
    }
  };
  let res = [];

  i.toString()
    .split("")
    .forEach((index) => {
      res.push(get_number(parseInt(index)));
    });
  return res.join("::");
}

/**
 *
 * @param {Message} message
 * @param {Client} client
 * @param {String[]} args
 * @returns {Guild|Object}
 */
async function fetchGuild(message, client, args) {
  client.error('fetchguild:modmail')
  let indexComp = 0;
  let embedIndex = 0;
  // let guildDataComp = client.guilds.cache
  //   .filter(async (g) => {
  //     return (
  //       (await client.db.get("modmail_" + g.id)) &&
  //       g.members.cache.get(message.author.id)
  //     );
  //   })
  //   .map((g, i) => {
  //     //console.log(g,i)
  //     //client.error(i)
  //     indexComp++;
  //     return new MessageButton()
  //       .setCustomId(g.id)
  //       .setLabel(`${indexComp}`)
  //       .setStyle("PRIMARY");
  //   });
  try {
  const row = new MessageActionRow();
  client.guilds.cache.forEach(async (g, i) => {
    //console.log(g,i)
    //client.error(i)

    const part1 = g.members.cache.get(message.author.id);
    const part2 = await client.db.get("modmail_" + g.id);
    if (!part1 && part2) return client.error('no:modmail:fetchguild:Array.forEach');
    indexComp++;
    if (indexComp < 5) return;
    row.addComponents(
      new MessageButton()
        .setCustomId(g.id)
        .setLabel(`${indexComp}`)
        .setStyle(g.available ? "PRIMARY" : "DANGER")
    );
  });
  // console.log(data_row_1.length)
  // client.error(row.components).catch(e => console.error(row.components))
  let embedRes = [];
  client.guilds.cache.forEach(async (g, i) => {
    const part1 = g.members.cache.get(message.author.id);
    const part2 = await client.db.get("modmail_" + g.id);
    if (!part1 && part2) return  client.error('fetchguild:modmail:embed:Array.forEach');
    embedIndex++;
    embedRes.push(
      ` (${embedIndex}) - [${g.name}](https://discord.com/channels/${g.id})`
    );
  });
  let embed = new MessageEmbed()
    .setAuthor(client.user.tag, client.user.displayAvatarURL())
    .setTitle("Choose a guild")
    .setDescription(embedRes.join("\n"));
  indexComp = 0;
  const row_2 = new MessageActionRow();
  const row_2_data = [];
indexComp = 0
  //console.log(g,i)
  //client.error(i)

  // const part1 = g.members.cache.get(message.author.id)
  // const part2 =  await client.db.get("modmail_" + g.id)
  // if(!part1 && part2) return null;
  for (const g of client.guilds.cache.toJSON()) {
    const part1 = g.members.cache.get(message.author.id);
    const part2 = await client.db.get("modmail_" + g.id);
    if (!part1 && part2) continue;
    indexComp++;
    if (5 > indexComp || indexComp < 10) return;
    row_2.addComponents(
      new MessageButton()
        .setCustomId(g.id)
        .setLabel(`${indexComp}`)
        .setStyle(g.available ? "PRIMARY" : "DANGER")
    );
  }

  // client.error(row_2_data)
  //  console.log(row_2_data.length, row_2_data)
  //row_2.setComponents(row_2_data);

  const row2 = new MessageActionRow().addComponents(
    new MessageButton()
      .setLabel("Next")
      .setStyle("PRIMARY")
      .setCustomId("next_modmail"),
    new MessageButton()
      .setLabel("Back")
      .setStyle("SECONDARY")
      .setDisabled(true)
      .setCustomId("back_modmail")
  );
  message.channel.send("re");
  message.channel
    .send({
      components: [row, row_2, row2],
      embeds: [embed],
      content: `Choose a Guild`,
    })
    .catch(client.error)
    .then(async (m) => {
      const collecter = await m.createMessageComponentCollector({
        filter: (i) => i,
        time: 60 * 1000 * 5,
      });
      collecter.on("collect", (i) => {
        const cmd = i.customId;
        if (cmd === "back_modmail") {
        }
        if (cmd === "next_modmail") {
        }
        i.deferReply();
        i.message.edit({
          components: i.message.components.map((c) => {
            return c.components.map((b) => {
              b.disabled = true;
              if (b.customId === cmd) b.style = 2;
              return b;
            });
          }),
          embeds: [
            {
              title: "Loading guild...",
              description: "...",
              color: i.message.embeds[0].color,
            },
          ],
        });
        return cmd;
      });
    });
  } catch (E) {
    client.error(E)
  }
}
/**
 *
 * @param {Message} message
 * @param {Client} client
 * @returns
 */
async function start(message, client, args) {
  client.error('Start:modmail')
  let g = await fetchGuild(message, client, args);
  if (!typeof g === "object") return message.reply("no g, got " + g);
  let chp = await client.db.get(`modmail_${g}`);
  if (!chp) return;
  let guild = client.guilds.cache.get(g);
  let perms = [
    { id: guild.id, deny: ["VIEW_CHANNEL"] },
    { id: client.user.id, allow: ["SEND_MESSAGES", "EMBED_LINKS"] },
  ];
  let roles = chp.roles;
  if (Array.isArray(roles) && roles.some((r) => typeof r === "STRING")) {
    for (const role of roles) {
      perms.push({ id: role, allow: ["VIEW_CHANNEL", "SEND_MESSAGES"] });
    }
  }
  let ch = await guild.channels.create(message.author.tag, {
    reason: `[MODMAIL] new session with ${message.author.tag}`,
    permissionOverwrites: perms,
  });
  ch.setParent(chp.id).catch((e) => {
    client.error(e);
    message.reply(
      "error making channel modmail! deleteing... send this error to the devs \n " +
        Buffer.from(e.message, "utf8").toString("base64")
    );
    ch.delete();
  });
  if (!(await map.exists({ user: message.author.id }))) {
    new map({
      g: g,
      user: message.author.id,
      ch: ch.id,
    }).save();
  } else {
    map.findOne({ user: message.author.id }).then((d) => d.remove());
    new map({
      g,
      user: message.author.id,
      ch: ch.id,
    }).save();
  }
  message.channel.send("Starting session");
  ch.send("SESSION WITH " + message.author.username);
  client.on("messageCreate", (m) => {
    if (m.author.bot) return;
    if (m.channel.id === ch.id) {
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setDescription(m.content)
            .setAuthor(
              m.author.tag,
              m.author.displayAvatarURL({ dynamic: true })
            )
            .setColor("GREEN")
            .setFooter(m.id)
            .setTimestamp(),
        ],
      });
    }
  });
}
/**
 *
 * @param {Message} message
 * @param {Client} client
 * @returns
 */
module.exports = async (message, client) => {
  if (message.author.bot) return;
  client.error('index:modmail')
  let args = message.content.slice("").trim().split(/ +/);
  let cmd = args.shift();
  if (cmd === "close") {
    message.reply("Ending");
    client.channels.cache
      .get(await map.findOne({ user: message.author.id }).ch)
      .send("closing.. in 3 secs")
      .then((ms) => {
        setTimeout(() => ms.channel.delete(), 3000);
      });
    map.findOne({ user: message.author.id }).then((mm) => mm.remove());
  } else {
    let user = await map.findOne({ user: message.author.id });
    if (!user) return start(message, client, args);
    let attachments = [];
    if (message.attachments) {
      message.attachments.forEach((att) => {
        attachments.push(new MessageAttachment(att.attachment, att.name));
      });
    }
    // console.log(user.ch)
    let ch = await client.channels.cache.fetch(user.ch);
    if (!ch)
      return message
        .reply("the channel has been deleted or not found! deleting session..")
        .then((m) => {
          map.FindOneAndRemove({ user: message.author.id });
        });
    ch.send({
      embeds: [
        new MessageEmbed()
          .setAuthor(
            message.author.tag,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setDescription(
            message.content +
              `\n ${attachments
                .map((att) => `[attachment/${att.name}]`)
                .join("\n")}`
          )
          .setTimestamp()
          .setFooter(message.id)
          .setColor("GREEN"),
      ],
      files: attachments,
    }).catch(client.error);
  }
};
