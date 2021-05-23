import { Message } from 'discord.js';

type argsTypes = {
    name: string;
    aliases: string[];
    description: string;
};

class Flag {
    public name: string;
    public aliases: string[];
    public description: string;

    constructor(args: argsTypes) {
        this.name = args.name;
        this.aliases = args.aliases;
        this.description = args.description;
    }

    public execute(message: Message): void {
        console.log(message);
    }
}

export default Flag;
