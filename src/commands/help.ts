import { Message } from 'discord.js';
import Command from 'src/libs/command';

class Help extends Command {
    constructor() {
        super({
            name: 'help',
            aliases: [''],
            description: 'Help command to show all the list.'
        });
    }

    public execute(message: Message): void {
        const embedObj = {
            title: 'Help Commands',
            description:
                'Please check the guide below on how to use bot. \
                The bot support two prefix: `ab` | `buddie`.',
            color: '#e53935',
            fields: [
                {
                    name: '**Usage Example: **',
                    value: '```ab help``````buddie help```'
                },
                {
                    name: '**Commands: **',
                    value: 'The bot accepts the below commands: \n \n'
                },
                {
                    name: '`help`',
                    value: 'Help command to show all the list.'
                },
                {
                    name: '`role`',
                    value: 'Role command to give yourself a role. Use this command to self assign roles.'
                }
            ]
        };

        message.channel.send({ embed: embedObj });
    }
}

export default Help;
