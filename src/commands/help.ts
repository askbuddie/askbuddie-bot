import { Message } from 'discord.js';
import Command from 'src/libs/command';

class Help extends Command {
    constructor() {
        super({
            name: 'help',
            aliases: [''],
            description:
                'Please check the guide below on how to use bot. \
            The bot support two prefix: `ab` | `buddie`.'
        });
    }

    public execute(message: Message): void {
        const embedObj = {
            title: 'Ask Buddie Help',
            description: this.description,
            color: '#e53935',
            fields: [
                {
                    name: '**Usage: **',
                    value: '`ab <command>` | `buddie <command>`'
                },
                {
                    name: '**Commands: **',
                    value: 'The bot accepts the below commands: \n \n'
                },
                {
                    name: '`help`',
                    value: 'Help command to show all the list of available commands.'
                },
                {
                    name: '`role`',
                    value: 'Role command to give yourself a role. Use this command to self assign and list roles.'
                },
                {
                    name: '`guru`',
                    value: 'Guides users on "How to Ask Questions" that will make it easy to understand.'
                }
            ]
        };

        message.channel.send({ embed: embedObj });
    }
}

export default Help;
