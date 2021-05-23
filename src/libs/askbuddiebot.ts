import { Client, Collection } from 'discord.js';

import * as flags from 'src/flags';
import config from 'src/config';
import Flag from 'src/libs/flag';

class AskBuddieBot extends Client {
    private config: configTypes;
    public flagList: Collection<unknown, Flag>;
    public readonly prefix: [string, string];

    constructor() {
        super();
        this.config = config;
        this.flagList = new Collection();
        this.prefix = ['ab', 'buddie'];
    }

    private loadFlags(): void {
        Object.entries(flags).forEach(([, flag]) => {
            const newFlag = new flag();
            this.flagList.set(newFlag.name, newFlag);
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
        this.loadFlags();
        this.authorize();
    }
}

export default AskBuddieBot;
