const { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, MessageFlags, SeparatorSpacingSize, ChannelType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("serverinfo").setDMPermission(false).setDescription("Display information about this server."),
  async execute(interaction) {
    const { guild } = interaction;
    const owner = await guild.fetchOwner();
    const textCh  = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
    const voiceCh = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;
    const bots    = guild.members.cache.filter(m => m.user.bot).size;
    const verif   = ["None","Low","Medium","High","Very High"];
    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${guild.name}`));
    c.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));
    if (guild.iconURL()) {
      c.addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(guild.iconURL({ size: 256 }))));
      c.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));
    }
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`📋 **Description:** ${guild.description || "None"}`));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**General**\n👑 **Owner:** ${owner.user.tag}\n🆔 **ID:** \`${guild.id}\`\n📅 **Created:** <t:${Math.floor(guild.createdTimestamp/1000)}:D>\n🌍 **Verification:** ${verif[guild.verificationLevel]??"Unknown"}`
    ));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**Members**\n👥 Total: **${guild.memberCount}** • 🤖 Bots: **${bots}** • 👤 Humans: **${guild.memberCount-bots}**`
    ));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**Channels & Roles**\n💬 Text: **${textCh}** • 🔊 Voice: **${voiceCh}**\n🏷️ Roles: **${guild.roles.cache.size-1}** • 😀 Emojis: **${guild.emojis.cache.size}**`
    ));
    if (guild.premiumSubscriptionCount) {
      c.addSeparatorComponents(new SeparatorBuilder());
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`💎 **Boosts:** ${guild.premiumSubscriptionCount} (Tier ${guild.premiumTier})`));
    }
    return interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
  },
};
