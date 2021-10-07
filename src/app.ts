import { GuildMember, Message, MessageEmbed } from 'discord.js';
import AskBuddieBot from 'src/libs/askbuddiebot';

const askBuddieBot = new AskBuddieBot();

// initialize our bot to load all the commands and authorize
askBuddieBot.initialize();

askBuddieBot.once('ready', () => {
    console.log('Ask Buddie bot is ready.');
});

// basic command handler with message event
askBuddieBot.on('message', (message: Message) => {
    const content = message.content;
    const prefix = askBuddieBot.prefix.find((p: string) =>
        content.startsWith(p)
    );

    if (!prefix || message.author.bot) return;

    const args = content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();

    if (!askBuddieBot.commandList.has(command)) return;

    try {
        askBuddieBot.commandList.get(command)?.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Error executing the command!');
    }
});

askBuddieBot.on('guildMemberAdd', (member: GuildMember) => {
    let channels = member.guild.channels.cache;
    let channel = channels.find(c => c.name.toLowerCase() === 'welcome');
    if (!channel) {
        channel = channels.find(c => c.permissionsFor(member)!.has("SEND_MESSAGES"));
    }
    if (channel?.isText()) {
        let message = new MessageEmbed()
            .setTitle(`Welcome to ${member.guild.name}!`)
            .setDescription('You can introduce yourself in the introduction channel');
        channel.send({ embed: message });
    }
});
