const { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MessageFlags } = require("discord.js");
function fmt(ms){if(!ms)return"0:00";const s=Math.floor(ms/1000),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;return h>0?`${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`:`${m}:${String(sec).padStart(2,"0")}`;}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play").setDMPermission(false)
    .setDescription("Play a song or playlist from YouTube, Spotify, SoundCloud and more.")
    .addStringOption(o=>o.setName("query").setDescription("Song name or URL").setRequired(true)),

  async execute(interaction, client) {
    await interaction.deferReply({ flags: MessageFlags.IsComponentsV2 });
    const vc = interaction.member.voice?.channel;
    if (!vc) {
      const c=new ContainerBuilder();c.addTextDisplayComponents(new TextDisplayBuilder().setContent("❌ Join a voice channel first."));
      return interaction.editReply({components:[c],flags:MessageFlags.IsComponentsV2});
    }
    const query = interaction.options.getString("query");
    let player = client.lavalink.getPlayer(interaction.guild.id);
    if (!player) {
      player = await client.lavalink.createPlayer({ guildId:interaction.guild.id, voiceChannelId:vc.id, textChannelId:interaction.channel.id, selfDeaf:true });
    }
    if (!player.connected) await player.connect();

    const isUrl = /^https?:\/\//.test(query);
    const result = await player.search(isUrl?{query}:{query,source:"ytsearch"}, interaction.user);
    if (!result?.tracks?.length) {
      const c=new ContainerBuilder();c.addTextDisplayComponents(new TextDisplayBuilder().setContent("❌ No results found."));
      return interaction.editReply({components:[c],flags:MessageFlags.IsComponentsV2});
    }

    if (result.loadType==="playlist") {
      await player.queue.add(result.tracks);
      const c=new ContainerBuilder();
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ✅ Playlist Queued`));
      c.addSeparatorComponents(new SeparatorBuilder());
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${result.playlist?.name??"Playlist"}**\n🎵 Added **${result.tracks.length}** tracks.`));
      await interaction.editReply({components:[c],flags:MessageFlags.IsComponentsV2});
    } else {
      const track=result.tracks[0];
      await player.queue.add(track);
      const pos=player.queue.tracks.length;
      const c=new ContainerBuilder();
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ✅ Track Queued`));
      c.addSeparatorComponents(new SeparatorBuilder());
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${track.info.title}**\nby ${track.info.author} • \`${fmt(track.info.duration)}\`\n📍 Position: **#${pos}**`));
      await interaction.editReply({components:[c],flags:MessageFlags.IsComponentsV2});
    }
    if (!player.playing && !player.paused) await player.play();
  },
};
