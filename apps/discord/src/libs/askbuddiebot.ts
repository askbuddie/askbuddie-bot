import { Client, Collection } from 'discord.js';

import * as commands from 'src/commands';
import config from 'src/config';
import Command from 'src/libs/command';

class AskBuddieBot extends Client {
    private config: configTypes;
    public commandList: Collection<unknown, Command>;
    public readonly prefix: [string, string];

    constructor() {
        super();
        this.config = config;
        this.commandList = new Collection();
        this.prefix = ['ab', 'buddie'];
    }

    private loadCommands(): void {
        Object.entries(commands).forEach(([, command]) => {
            const newCommand = new command();
            this.commandList.set(newCommand.name, newCommand);
        });
    }

    private async authorize(): Promise<void> {
        const { DISCORD_TOKEN } = this.config;
        if (!DISCORD_TOKEN) {
            throw new Error(
                'Token is missing, please provide a Discord token!'
            );
        }
        await super.login(DISCORD_TOKEN);
    }

    public initialize(): void {
        this.loadCommands();
        this.authorize();
    }
}

export default AskBuddieBot;
