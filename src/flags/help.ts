import { Message } from 'discord.js';
import Flag from 'src/libs/flag';

class Help extends Flag {
    constructor() {
        super({
            name: '--help',
            aliases: [''],
            description: 'Help command to show all the list.'
        });
    }

    public execute(message: Message): void {
        const embedObj = {
            title: 'Help Commands',
            description:
                'Please check the guide below on how to use bot. \
                The bot support two commands or prefix: `ab` | `buddie`.',
            color: '#e53935',
            fields: [
                {
                    name: '**Usage Example: **',
                    value: '```ab --help``````buddie --help```'
                },
                {
                    name: '**Flags/Options: **',
                    value: 'The bot accepts command as flag/option: \n \n'
                },
                {
                    name: '`--help`',
                    value: 'Help command to show all the list.'
                }
            ]
        };

        message.channel.send({ embed: embedObj });
    }
}

export default Help;
