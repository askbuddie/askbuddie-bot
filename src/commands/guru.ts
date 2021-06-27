import { Message } from 'discord.js';
import Command from 'src/libs/command';

export default class GuruCMD extends Command {
    constructor() {
        super({
            name: 'guru',
            aliases: [''],
            description: 'Please check the guide below on how to ask questions.'
        });
    }

    execute(message: Message): void {
        const embedObj = {
            title: 'Guidelines',
            description: this.description,
            color: '#e53935',
            fields: [
                {
                    name: "Don't ask to ask, just ask",
                    value: `Include as much as information you can to describe to problem directly. 
            Don't ask to ask, just ask it and the members will not have to ask you in return. 
            Such question will decrease the user engagement and the problem gets unnoticed most of the time.
            <https://dontasktoask.com/>`
                },
                {
                    name: 'Code formatting',
                    value: `No plain text or screenshot
                Make use of markdown provided by Discord to format the code and improve readability. It will be easier for others to go through the code. Don't post the screenshot of code as well. Keep it clean with the available features.
                Read more about markdown: https://www.markdownguide.org/cheat-sheet/
                
                Apart from markdown you can use below platform for code sharing:
                GitHub Gist: https://gist.github.com/
                CodeSandbox: https://codesandbox.io/s/
                Pastebin: https://pastebin.com/"`
                }
            ]
        };
        message.channel.send({ embed: embedObj });
    }
}
