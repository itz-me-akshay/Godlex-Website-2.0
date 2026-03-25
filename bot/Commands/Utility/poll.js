const { SlashCommandBuilder, PermissionsBitField, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MessageFlags } = require("discord.js");
const db       = require("../../Database/db");
const schedule = require("node-schedule");

// Re-schedule any reminders that survived a restart
function restoreReminders(client) {
  for (const [id, r] of db.reminders.entries()) {
    const fireAt = new Date(r.fireAt);
    if (fireAt <= new Date()) {
      // Overdue — fire immediately
      fireReminder(client, id, r);
    } else {
      schedule.scheduleJob(id, fireAt, () => fireReminder(client, id, r));
    }
  }
}

async function fireReminder(client, id, r) {
  try {
    const ch = await client.channels.fetch(r.channelId).catch(() => null);
    if (ch) {
      const c = new ContainerBuilder();
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`⏰ <@${r.userId}> **Reminder!**\n> ${r.text}`));
      ch.send({ components:[c], flags:MessageFlags.IsComponentsV2 });
    }
  } catch {}
  db.reminders.delete(id);
}

let reminderCounter = 0;

const poll = {
  data: new SlashCommandBuilder().setName("poll").setDMPermission(false).setDescription("Manage the poll auto-react system.")
    .addSubcommand(s=>s.setName("setup").setDescription("Enable polls in a channel.").addChannelOption(o=>o.setName("channel").setDescription("Channel (defaults to current)").setRequired(false)))
    .addSubcommand(s=>s.setName("disable").setDescription("Disable the poll system.")),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return interaction.reply({ content:"❌ Administrator permission required.", flags:[MessageFlags.Ephemeral] });
    const sub = interaction.options.getSubcommand();
    if (sub === "setup") {
      const ch = interaction.options.getChannel("channel") ?? interaction.channel;
      db.pollChannels.set(interaction.guild.id, ch.id);
      const c = new ContainerBuilder();
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🗳️ Poll System Enabled`));
      c.addSeparatorComponents(new SeparatorBuilder());
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Messages sent in ${ch} will get 👍 and 👎 reactions.`));
      return interaction.reply({ components:[c], flags:MessageFlags.IsComponentsV2 });
    }
    db.pollChannels.delete(interaction.guild.id);
    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent("✅ Poll system **disabled**."));
    return interaction.reply({ components:[c], flags:MessageFlags.IsComponentsV2 });
  },
};

const reminder = {
  data: new SlashCommandBuilder().setName("reminder").setDescription("Set a personal reminder.")
    .addStringOption(o=>o.setName("text").setDescription("What to remind you about").setRequired(true))
    .addIntegerOption(o=>o.setName("minutes").setDescription("Remind me in N minutes").setMinValue(1).setMaxValue(10080).setRequired(true)),
  async execute(interaction, client) {
    const text   = interaction.options.getString("text");
    const mins   = interaction.options.getInteger("minutes");
    const fireAt = new Date(Date.now() + mins * 60_000);
    const id     = `reminder_${Date.now()}_${++reminderCounter}`;
    const data   = { userId:interaction.user.id, channelId:interaction.channel.id, text, fireAt:fireAt.toISOString() };
    db.reminders.set(id, data);
    schedule.scheduleJob(id, fireAt, () => fireReminder(client, id, data));
    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`✅ Reminder set!\n> **${text}**\n\n⏱️ I'll remind you <t:${Math.floor(fireAt.getTime()/1000)}:R>`));
    return interaction.reply({ components:[c], flags:[MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] });
  },
};

module.exports = [poll, reminder];
module.exports.restoreReminders = restoreReminders;
