const { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags } = require("discord.js");
const cv2=(t)=>{const c=new ContainerBuilder();c.addTextDisplayComponents(new TextDisplayBuilder().setContent(t));return c;};
const errR=(i,t)=>i.reply({components:[cv2(t)],flags:[MessageFlags.IsComponentsV2,MessageFlags.Ephemeral]});
const okR=(i,t)=>i.reply({components:[cv2(t)],flags:MessageFlags.IsComponentsV2});
function check(interaction,player){
  if(!interaction.member.voice?.channel)return"novc";
  if(!player)return"noplayer";
  if(interaction.member.voice.channelId!==player.voiceChannelId)return"wrongvc";
  return"ok";
}

const skip={
  data:new SlashCommandBuilder().setName("skip").setDMPermission(false).setDescription("Skip the current track."),
  async execute(interaction,client){
    const player=client.lavalink.getPlayer(interaction.guild.id);
    const r=check(interaction,player);
    if(r==="novc")return errR(interaction,"❌ Join a voice channel first.");
    if(r==="noplayer")return errR(interaction,"❌ Nothing is playing.");
    if(r==="wrongvc")return errR(interaction,"❌ Wrong voice channel.");
    if(!player.queue.current)return errR(interaction,"❌ Nothing is playing.");
    const title=player.queue.current.info.title;
    await player.skip();
    return okR(interaction,`⏭️ Skipped: **${title}**`);
  },
};
const pause={
  data:new SlashCommandBuilder().setName("pause").setDMPermission(false).setDescription("Pause the current track."),
  async execute(interaction,client){
    const player=client.lavalink.getPlayer(interaction.guild.id);
    const r=check(interaction,player);
    if(r!=="ok")return errR(interaction,r==="novc"?"❌ Join a voice channel.":r==="noplayer"?"❌ Nothing is playing.":"❌ Wrong channel.");
    if(player.paused)return errR(interaction,"⚠️ Already paused. Use `/resume`.");
    await player.pause();
    return okR(interaction,"⏸️ Paused.");
  },
};
const resume={
  data:new SlashCommandBuilder().setName("resume").setDMPermission(false).setDescription("Resume a paused track."),
  async execute(interaction,client){
    const player=client.lavalink.getPlayer(interaction.guild.id);
    const r=check(interaction,player);
    if(r!=="ok")return errR(interaction,r==="novc"?"❌ Join a voice channel.":r==="noplayer"?"❌ Nothing is playing.":"❌ Wrong channel.");
    if(!player.paused)return errR(interaction,"⚠️ Not paused.");
    await player.resume();
    return okR(interaction,"▶️ Resumed.");
  },
};
const stop={
  data:new SlashCommandBuilder().setName("stop").setDMPermission(false).setDescription("Stop music and clear the queue."),
  async execute(interaction,client){
    const player=client.lavalink.getPlayer(interaction.guild.id);
    const r=check(interaction,player);
    if(r!=="ok")return errR(interaction,r==="novc"?"❌ Join a voice channel.":r==="noplayer"?"❌ Nothing is playing.":"❌ Wrong channel.");
    await player.destroy();
    return okR(interaction,"⏹️ Stopped and queue cleared.");
  },
};
const disconnect={
  data:new SlashCommandBuilder().setName("disconnect").setDMPermission(false).setDescription("Disconnect the bot from voice."),
  async execute(interaction,client){
    const player=client.lavalink.getPlayer(interaction.guild.id);
    const r=check(interaction,player);
    if(r!=="ok")return errR(interaction,r==="novc"?"❌ Join a voice channel.":r==="noplayer"?"❌ Bot not in voice.":"❌ Wrong channel.");
    await player.destroy();
    return okR(interaction,"👋 Disconnected.");
  },
};
module.exports=[skip,pause,resume,stop,disconnect];
