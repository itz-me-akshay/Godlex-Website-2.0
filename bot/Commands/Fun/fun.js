const { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MessageFlags } = require("discord.js");
const cv2 = t => { const c = new ContainerBuilder(); c.addTextDisplayComponents(new TextDisplayBuilder().setContent(t)); return c; };

const BALL = ["✅ It is certain.","✅ It is decidedly so.","✅ Without a doubt.","✅ Yes, definitely.","✅ You may rely on it.","✅ As I see it, yes.","✅ Most likely.","✅ Outlook good.","✅ Yes.","✅ Signs point to yes.","⚠️ Reply hazy, try again.","⚠️ Ask again later.","⚠️ Better not tell you now.","⚠️ Cannot predict now.","⚠️ Concentrate and ask again.","❌ Don't count on it.","❌ My reply is no.","❌ My sources say no.","❌ Outlook not so good.","❌ Very doubtful."];

const JOKES = [
  ["Why don't scientists trust atoms?","Because they make up everything!"],
  ["What do you call a fish without eyes?","A fsh!"],
  ["Why did the scarecrow win an award?","He was outstanding in his field!"],
  ["Why don't eggs tell jokes?","They'd crack each other up!"],
  ["What do you call fake spaghetti?","An impasta!"],
  ["How does a penguin build its house?","Igloos it together!"],
  ["What do you call cheese that isn't yours?","Nacho cheese!"],
  ["Why can't you give Elsa a balloon?","Because she'll let it go!"],
  ["What do you call a sleeping dinosaur?","A dino-snore!"],
  ["Why did the math book look so sad?","Because it had too many problems!"],
  ["What do you call a belt made of watches?","A waist of time!"],
  ["Why don't skeletons fight each other?","They don't have the guts!"],
  ["What did the ocean say to the beach?","Nothing, it just waved."],
  ["Why did the bicycle fall over?","Because it was two-tired!"],
  ["What do you call a pile of cats?","A meow-ntain!"],
];

const eightBall = {
  data: new SlashCommandBuilder().setName("8ball").setDescription("Ask the magic 8-ball a question.").addStringOption(o=>o.setName("question").setDescription("Your question").setRequired(true)),
  async execute(interaction) {
    const q = interaction.options.getString("question");
    const a = BALL[Math.floor(Math.random()*BALL.length)];
    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# 🎱 Magic 8-Ball`));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Question:** ${q}\n**Answer:** ${a}`));
    return interaction.reply({ components:[c], flags:MessageFlags.IsComponentsV2 });
  },
};
const coinflip = {
  data: new SlashCommandBuilder().setName("coinflip").setDescription("Flip a coin."),
  async execute(interaction) {
    return interaction.reply({ components:[cv2(`# ${Math.random()<0.5?"🪙 Heads":"🪙 Tails"}`)], flags:MessageFlags.IsComponentsV2 });
  },
};
const joke = {
  data: new SlashCommandBuilder().setName("joke").setDescription("Get a random joke."),
  async execute(interaction) {
    const [setup,punchline] = JOKES[Math.floor(Math.random()*JOKES.length)];
    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# 😄 Joke`));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${setup}**\n\n||${punchline}||`));
    return interaction.reply({ components:[c], flags:MessageFlags.IsComponentsV2 });
  },
};
const roll = {
  data: new SlashCommandBuilder().setName("roll").setDescription("Roll a dice.").addIntegerOption(o=>o.setName("sides").setDescription("Sides (default 6)").setMinValue(2).setMaxValue(1000).setRequired(false)),
  async execute(interaction) {
    const sides = interaction.options.getInteger("sides")??6;
    return interaction.reply({ components:[cv2(`🎲 You rolled a **d${sides}** and got: **${Math.floor(Math.random()*sides)+1}**`)], flags:MessageFlags.IsComponentsV2 });
  },
};
const reverse = {
  data: new SlashCommandBuilder().setName("reverse").setDescription("Reverse a piece of text.").addStringOption(o=>o.setName("text").setDescription("Text to reverse").setRequired(true)),
  async execute(interaction) {
    const text = interaction.options.getString("text");
    const rev  = text.split("").reverse().join("");
    const c = new ContainerBuilder();
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`# 🔄 Reversed`));
    c.addSeparatorComponents(new SeparatorBuilder());
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Original:** ${text}\n**Reversed:** ${rev}`));
    return interaction.reply({ components:[c], flags:MessageFlags.IsComponentsV2 });
  },
};

module.exports = [eightBall, coinflip, joke, roll, reverse];
