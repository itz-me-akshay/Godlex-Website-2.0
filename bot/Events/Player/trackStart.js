const {
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
  StringSelectMenuBuilder, ContainerBuilder,
  TextDisplayBuilder, SeparatorBuilder, MessageFlags,
} = require("discord.js");

function fmt(ms) {
  if (!ms) return "0:00";
  const s=Math.floor(ms/1000),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;
  return h>0?`${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`:`${m}:${String(sec).padStart(2,"0")}`;
}

module.exports = {
  name: "trackStart",
  async execute(player, track, _payload, client) {
    const ch = client.channels.cache.get(player.textChannelId);
    if (!ch) return;

    const c = new ContainerBuilder();
    c.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## 🎵 Now Playing\n**${track.info.title}**\nby ${track.info.author} • \`${fmt(track.info.duration)}\``
      )
    );
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `🔗 [Open Link](${track.info.uri}) • Requested by ${track.requester ?? "Unknown"}`
      )
    );

    const btnRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("music_previous").setLabel("⏮ Prev").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("music_pause").setLabel("⏸ Pause").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("music_skip").setLabel("⏭ Skip").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("music_stop").setLabel("⏹ Stop").setStyle(ButtonStyle.Danger),
    );
    const selRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder().setCustomId("music_controls_select").setPlaceholder("More controls…").addOptions([
        { label:"Shuffle",      description:"Shuffle the queue",       value:"shuffle"     },
        { label:"Loop: Off",    description:"No repeat",               value:"loop_off"    },
        { label:"Loop: Track",  description:"Repeat current track",    value:"loop_track"  },
        { label:"Loop: Queue",  description:"Repeat whole queue",      value:"loop_queue"  },
        { label:"Volume -20%",  description:"Decrease volume",         value:"volume_down" },
        { label:"Volume +20%",  description:"Increase volume",         value:"volume_up"   },
      ])
    );

    const msg = await ch.send({
      components: [c, btnRow, selRow],
      flags: MessageFlags.IsComponentsV2,
    }).catch(() => null);

    if (msg) { player.set("npMsgId", msg.id); player.set("npChId", ch.id); }
  },
};
