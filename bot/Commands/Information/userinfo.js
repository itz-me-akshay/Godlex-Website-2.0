const { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, MessageFlags, SeparatorSpacingSize } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("userinfo").setDMPermission(false).setDescription("Display information about a member.")
    .addUserOption(o => o.setName("user").setDescription("User to look up").setRequired(false)),
  async execute(interaction) {
    const user   = interaction.options.getUser("user") ?? interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: "❌ Could not find that member.", flags: [MessageFlags.Ephemeral] });

    const roles = member.roles.cache.filter(r => r.id !== interaction.guild.id)
      .sort((a, b) => b.position - a.position).map(r => `<@&${r.id}>`).slice(0, 10).join(" ") || "None";

    const badges = (user.flags?.toArray() ?? []).map(f => ({
      Staff:"👔", Partner:"🤝", Hypesquad:"⭐", BugHunterLevel1:"🐛", BugHunterLevel2:"🐛🐛",
      HypeSquadOnlineHouse1:"🦁", HypeSquadOnlineHouse2:"✨", HypeSquadOnlineHouse3:"⚖️",
      PremiumEarlySupporter:"🅿️", ActiveDeveloper:"💻",
    }[f])).filter(Boolean).join(" ") || "None";

    const joinPos = await interaction.guild.members.fetch()
      .then(m => [...m.values()].sort((a,b)=>a.joinedTimestamp-b.joinedTimestamp).findIndex(m=>m.id===member.id)+1)
      .catch(() => "?");

    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `# ${user.tag} ${member.id===interaction.guild.ownerId?"👑":""}`
    ));
    c.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));
    c.addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(member.displayAvatarURL({ size: 256 }))));
    c.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**General**\n🆔 \`${user.id}\`\n📅 Created: <t:${Math.floor(user.createdTimestamp/1000)}:D>\n📥 Joined: <t:${Math.floor(member.joinedTimestamp/1000)}:D> (Position #${joinPos})\n🏅 Badges: ${badges}`
    ));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**Server Profile**\n📛 Nickname: ${member.nickname??"None"}\n💎 Booster: ${member.premiumSince?`<t:${Math.floor(member.premiumSinceTimestamp/1000)}:D>`:"No"}\n🔇 Timeout: ${member.communicationDisabledUntilTimestamp?`<t:${Math.floor(member.communicationDisabledUntilTimestamp/1000)}:R>`:"No"}`
    ));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Roles (${member.roles.cache.size-1})**\n${roles}`));
    return interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
  },
};
