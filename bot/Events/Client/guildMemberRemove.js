const {
  ContainerBuilder, TextDisplayBuilder, SeparatorBuilder,
  MessageFlags, SeparatorSpacingSize,
} = require("discord.js");
const db = require("../../Database/db");

module.exports = {
  name: "guildMemberRemove",
  async execute(member, client) {
    const { guild, user } = member;
    const cfg = db.leaveConfig.get(guild.id);
    if (!cfg) return;
    const channel = guild.channels.cache.get(cfg.channelId);
    if (!channel) return;

    const msg = (cfg.message || "**{user}** has left **{server}**. Goodbye!")
      .replace("{user}",        user.tag)
      .replace("{server}",      guild.name)
      .replace("{membercount}", guild.memberCount);

    const c = new ContainerBuilder();
    c.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`# 👋 Goodbye!`)
    );
    c.addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
    );
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(msg));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `📊 We now have **${guild.memberCount}** members.`
      )
    );

    channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
  },
};
