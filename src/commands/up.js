const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
module.exports = [
  {
    name: "uptime",
    execute(message, args, client) {
      let days = Math.floor(client.uptime / 86400000);
      let hours = Math.floor(client.uptime / 3600000) % 24;
      let minutes = Math.floor(client.uptime / 60000) % 60;
      let seconds = Math.floor(client.uptime / 1000) % 60;

      message.channel
        .send(`__Uptime:__\n${days}d ${hours}h ${minutes}m ${seconds}s \n
total time in ms: ${client.uptime}`);
    },
  },
  {
    name: "uptime",
    data: new SlashCommandBuilder()
      .setName("stat")
      .setDescription("The stats of the bot section")
      .addSubcommandGroup((cmd) =>
        cmd.setName("uptime").setDescription("the uptime of the bot")
      ),
    type: "slash",
    async execute(interaction, cmd, args, client) {
      let days = Math.floor(client.uptime / 86400000);
      let hours = Math.floor(client.uptime / 3600000) % 24;
      let minutes = Math.floor(client.uptime / 60000) % 60;
      let seconds = Math.floor(client.uptime / 1000) % 60;

      interaction.reply(
        `__Uptime:__\n${days}d ${hours}h ${minutes}m ${seconds}s \nor\n ${require("ms")(
          client.uptime
        )} `
      );
    },
  }, {
name: 'stat',
async execute(message,args,client){
  const m = await message.reply({ content: 'Fetching stats..' })
  const msg = await client.channels.cache.get('830471074193080381')?.messages.fetch('830471635589005312')
m.edit({ content: '', embeds: msg.embeds, components: [new MessageActionRow().addComponents(new MessageButton().setStyle('LINK').setURL(msg.url).setLabel('Message link'))] })
}
  }
];
