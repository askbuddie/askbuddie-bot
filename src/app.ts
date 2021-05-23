import AskBuddieBot from 'src/libs/askbuddiebot';

const askBuddieBot = new AskBuddieBot();

// initialize our bot to load all the flags and authorize
askBuddieBot.initialize();

askBuddieBot.once('ready', () => {
    console.log('Ask Buddie bot is ready.');
});

// basic flag handler with message event
askBuddieBot.on('message', (message) => {
    const content = message.content;
    const prefix = askBuddieBot.prefix.find((p) => content.startsWith(p));

    if (!prefix || message.author.bot) return;

    const args = content.slice(prefix.length).trim().split(/ +/);
    const flag = args.shift()?.toLowerCase();

    if (!askBuddieBot.flagList.has(flag)) return;

    try {
        console.log(askBuddieBot.flagList.get(flag)?.execute(message));
    } catch (error) {
        console.error(error);
        message.reply('Error executing the command!');
    }
});
