import { Message } from 'discord.js';

type commandTypes = {
    name: string;
    aliases: string[];
    description: string;
};

class Command {
    public name: string;
    public aliases: string[];
    public description: string;

    constructor(args: commandTypes) {
        this.name = args.name;
        this.aliases = args.aliases;
        this.description = args.description;
    }

    public execute(message: Message, args: string[]): void {
        console.log('msg: ', message);
        console.log('args: ', args);
    }
}

export default Command;
