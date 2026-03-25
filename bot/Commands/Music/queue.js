const { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MessageFlags, SeparatorSpacingSize } = require("discord.js");
function fmt(ms){if(!ms)return"0:00";const s=Math.floor(ms/1000),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;return h>0?`${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`:`${m}:${String(sec).padStart(2,"0")}`;}
const cv2=(t)=>{const c=new ContainerBuilder();c.addTextDisplayComponents(new TextDisplayBuilder().setContent(t));return c;};
const errR=(i,t)=>i.reply({components:[cv2(t)],flags:[MessageFlags.IsComponentsV2,MessageFlags.Ephemeral]});

const volume={
  data:new SlashCommandBuilder().setName("volume").setDMPermission(false).setDescription("Set the playback volume (1–100).")
    .addIntegerOption(o=>o.setName("level").setDescription("Volume level").setMinValue(1).setMaxValue(100).setRequired(true)),
  async execute(interaction,client){
    const player=client.lavalink.getPlayer(interaction.guild.id);
    if(!player?.queue.current)return errR(interaction,"❌ Nothing is playing.");
    const level=interaction.options.getInteger("level");
    await player.setVolume(level);
    return interaction.reply({components:[cv2(`🔊 Volume set to **${level}%**`)],flags:MessageFlags.IsComponentsV2});
  },
};

const loop={
  data:new SlashCommandBuilder().setName("loop").setDMPermission(false).setDescription("Set the loop mode.")
    .addStringOption(o=>o.setName("mode").setDescription("Loop mode").setRequired(true)
      .addChoices({name:"Off",value:"off"},{name:"Track",value:"track"},{name:"Queue",value:"queue"})),
  async execute(interaction,client){
    const player=client.lavalink.getPlayer(interaction.guild.id);
    if(!player?.queue.current)return errR(interaction,"❌ Nothing is playing.");
    const mode=interaction.options.getString("mode");
    await player.setRepeatMode(mode);
    const icons={off:"🔁 Loop **off**.",track:"🔂 Looping current **track**.",queue:"🔁 Looping entire **queue**."};
    return interaction.reply({components:[cv2(icons[mode])],flags:MessageFlags.IsComponentsV2});
  },
};

const shuffle={
  data:new SlashCommandBuilder().setName("shuffle").setDMPermission(false).setDescription("Shuffle the queue."),
  async execute(interaction,client){
    const player=client.lavalink.getPlayer(interaction.guild.id);
    if(!player?.queue.tracks.length)return errR(interaction,"❌ Queue is empty.");
    player.queue.shuffle();
    return interaction.reply({components:[cv2(`🔀 Shuffled **${player.queue.tracks.length}** tracks.`)],flags:MessageFlags.IsComponentsV2});
  },
};

const queue={
  data:new SlashCommandBuilder().setName("queue").setDMPermission(false).setDescription("View the current queue.")
    .addIntegerOption(o=>o.setName("page").setDescription("Page number").setMinValue(1).setRequired(false)),
  async execute(interaction,client){
    const player=client.lavalink.getPlayer(interaction.guild.id);
    if(!player?.queue.current)return errR(interaction,"❌ Queue is empty.");
    const PER=10,tracks=player.queue.tracks,current=player.queue.current;
    const pages=Math.max(1,Math.ceil(tracks.length/PER));
    const page=Math.min(interaction.options.getInteger("page")??1,pages);
    const start=(page-1)*PER;
    const list=tracks.slice(start,start+PER).map((t,i)=>`**${start+i+1}.** ${t.info.title} — \`${fmt(t.info.duration)}\``).join("\n")||"— empty —";
    const loopIcon={off:"🔁 Off",track:"🔂 Track",queue:"🔁 Queue"}[player.repeatMode??"off"];
    const c=new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🎵 Queue — Page ${page}/${pages}`));
    c.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Now Playing:**\n🎵 ${current.info.title} — \`${fmt(current.info.duration)}\``));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Up Next:**\n${list}`));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`📋 **${tracks.length}** track(s) • Loop: ${loopIcon} • Vol: **${player.volume??100}%**`));
    return interaction.reply({components:[c],flags:MessageFlags.IsComponentsV2});
  },
};

const nowplaying={
  data:new SlashCommandBuilder().setName("nowplaying").setDMPermission(false).setDescription("Show the currently playing track."),
  async execute(interaction,client){
    const player=client.lavalink.getPlayer(interaction.guild.id);
    if(!player?.queue.current)return errR(interaction,"❌ Nothing is playing.");
    const track=player.queue.current,pos=player.position??0,dur=track.info.duration??0;
    const BAR=20,filled=dur>0?Math.round((pos/dur)*BAR):0;
    const bar="█".repeat(filled)+"░".repeat(BAR-filled);
    const loopIcon={off:"🔁 Off",track:"🔂 Track",queue:"🔁 Queue"}[player.repeatMode??"off"];
    const c=new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🎵 Now Playing`));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**${track.info.title}**\nby ${track.info.author}\n\n\`${fmt(pos)}\` ${bar} \`${fmt(dur)}\`\n\n`+
      `🔊 Vol: **${player.volume??100}%** • Loop: ${loopIcon} • ${player.paused?"⏸ Paused":"▶️ Playing"}`
    ));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`🔗 [Open Link](${track.info.uri}) • Requested by ${track.requester??"Unknown"}\n📋 **${player.queue.tracks.length}** track(s) up next`));
    return interaction.reply({components:[c],flags:MessageFlags.IsComponentsV2});
  },
};

const search={
  data:new SlashCommandBuilder().setName("search").setDMPermission(false).setDescription("Search and pick a track to play.")
    .addStringOption(o=>o.setName("query").setDescription("Song name").setRequired(true)),
  async execute(interaction,client){
    await interaction.deferReply({flags:MessageFlags.IsComponentsV2});
    const vc=interaction.member.voice?.channel;
    if(!vc){const c=new ContainerBuilder();c.addTextDisplayComponents(new TextDisplayBuilder().setContent("❌ Join a voice channel first."));return interaction.editReply({components:[c],flags:MessageFlags.IsComponentsV2});}
    const query=interaction.options.getString("query");
    let player=client.lavalink.getPlayer(interaction.guild.id)??await client.lavalink.createPlayer({guildId:interaction.guild.id,voiceChannelId:vc.id,textChannelId:interaction.channel.id,selfDeaf:true});
    const result=await player.search({query,source:"ytsearch"},interaction.user);
    if(!result?.tracks?.length){const c=new ContainerBuilder();c.addTextDisplayComponents(new TextDisplayBuilder().setContent("❌ No results found."));return interaction.editReply({components:[c],flags:MessageFlags.IsComponentsV2});}
    const top5=result.tracks.slice(0,5);
    const listText=top5.map((t,i)=>`**${i+1}.** ${t.info.title} — by ${t.info.author} [\`${fmt(t.info.duration)}\`]`).join("\n");
    const {ActionRowBuilder,StringSelectMenuBuilder,ComponentType}=require("discord.js");
    const c=new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🔍 Search Results`));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(listText));
    const selRow=new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder().setCustomId("search_pick").setPlaceholder("Pick a track…")
        .addOptions(top5.map((t,i)=>({label:t.info.title.slice(0,100),description:`by ${t.info.author.slice(0,50)}`,value:String(i)})))
    );
    const reply=await interaction.editReply({components:[c,selRow],flags:MessageFlags.IsComponentsV2});
    const collector=reply.createMessageComponentCollector({componentType:ComponentType.StringSelect,filter:i=>i.user.id===interaction.user.id&&i.customId==="search_pick",time:30_000,max:1});
    collector.on("collect",async i=>{
      const track=top5[parseInt(i.values[0])];
      await i.deferUpdate();
      if(!player.connected)await player.connect();
      await player.queue.add(track);
      const done=new ContainerBuilder();done.addTextDisplayComponents(new TextDisplayBuilder().setContent(`✅ Added **${track.info.title}** to the queue.`));
      await interaction.editReply({components:[done],flags:MessageFlags.IsComponentsV2});
      if(!player.playing&&!player.paused)await player.play();
    });
    collector.on("end",collected=>{
      if(!collected.size){const exp=new ContainerBuilder();exp.addTextDisplayComponents(new TextDisplayBuilder().setContent("⏱️ Search timed out."));interaction.editReply({components:[exp],flags:MessageFlags.IsComponentsV2}).catch(()=>{});}
    });
  },
};

module.exports=[volume,loop,shuffle,queue,nowplaying,search];
