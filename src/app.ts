import { Message } from 'discord.js';
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
