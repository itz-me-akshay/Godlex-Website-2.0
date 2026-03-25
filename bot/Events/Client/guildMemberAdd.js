const {
  ContainerBuilder, TextDisplayBuilder, SeparatorBuilder,
  MediaGalleryBuilder, MediaGalleryItemBuilder,
  MessageFlags, SeparatorSpacingSize,
} = require("discord.js");
const db = require("../../Database/db");

module.exports = {
  name: "guildMemberAdd",
  async execute(member, client) {
    const { guild, user } = member;

    // ── Auto-role ────────────────────────────────────────────────────────────
    const roleId = db.autoRole.get(guild.id);
    if (roleId) {
      const role = guild.roles.cache.get(roleId);
      if (role) member.roles.add(role).catch(() => {});
    }

    // ── Welcome message ──────────────────────────────────────────────────────
    const cfg = db.welcomeConfig.get(guild.id);
    if (!cfg) return;
    const channel = guild.channels.cache.get(cfg.channelId);
    if (!channel) return;

    const msg = (cfg.message || "Welcome {user} to **{server}**! 🎉")
      .replace("{user}",        user.toString())
      .replace("{server}",      guild.name)
      .replace("{membercount}", guild.memberCount);

    const c = new ContainerBuilder();
    c.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`# 👋 Welcome!`)
    );
    c.addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
    );
    c.addMediaGalleryComponents(
      new MediaGalleryBuilder().addItems(
        new MediaGalleryItemBuilder().setURL(user.displayAvatarURL({ size: 256 }))
      )
    );
    c.addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
    );
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(msg));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `📌 You are member **#${guild.memberCount}** of **${guild.name}**`
      )
    );

    channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
  },
};
