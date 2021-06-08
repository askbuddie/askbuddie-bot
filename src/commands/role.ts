import {
    ClientUser,
    Collection,
    Guild,
    GuildMember,
    Message,
    Role,
    Snowflake
} from 'discord.js';
import Command from 'src/libs/command';

type RoleList = {
    [key: string]: string;
};

class RoleCMD extends Command {
    constructor() {
        super({
            name: 'role',
            aliases: [''],
            description: 'Command to give yourself a role'
        });
    }

    // Usage for invalid command
    private invalidCMD(message: Message): void {
        const embedObj = {
            title: 'Role Command',
            description: this.description,
            color: '#e53935',
            fields: [
                {
                    name: '**Usage Example: **',
                    value: '`ab role <role>` | `buddie role <role>`'
                },
                {
                    name: '**Flags: **',
                    value: 'This command accepts the following flags. \n \n'
                },
                {
                    name: '`--multi`',
                    value: 'Assign multiple role at once. \n'
                },
                {
                    name: '`--list`',
                    value: 'List the available roles. \n'
                }
            ]
        };

        message.channel.send({ embed: embedObj });
    }

    private listRoles(guild: Guild, message: Message, bot: ClientUser): void {
        guild.members.fetch(bot.id).then((botMember: GuildMember) => {
            const roleList = this.getAvailableRoles(guild, botMember);

            const rolesStr = Object.keys(roleList)
                .map((r: string) => `[ ${r.toLowerCase()} ]`)
                .join(' ');

            const msg = '**Available Roles: ** ```ini\n' + rolesStr + '```';

            message.channel.send(msg);
        });
    }

    private getAvailableRoles(guild: Guild, botMember: GuildMember): RoleList {
        // Get bot role position
        let botHighestPosition = 0;
        const botRole = botMember.roles.highest;
        if (botRole !== undefined) {
            botHighestPosition = botRole.rawPosition;
        }

        // List of guild roles
        const roleList: RoleList = {};
        guild?.roles.cache.forEach((role: Role) => {
            // get list a roles below the bot role and ignore the role @everyone
            if (
                botHighestPosition > role.rawPosition &&
                role.name.toLowerCase() !== '@everyone'
            )
                roleList[role.name.toLowerCase()] = role.id;
        });

        return roleList;
    }

    public execute(message: Message, args: string[]): void {
        const first = args.shift();

        let reqRoles: string[] = [];

        const guild = message.guild;
        const bot = guild?.client.user;

        if (!bot) {
            throw new Error('Bot not found.');
        }

        // Check for flags
        if (first === '--multi') {
            if (args.length === 0) {
                this.invalidCMD(message);
                return;
            }

            reqRoles = args;
        } else if (first === '--list' && guild) {
            // List role flag
            this.listRoles(guild, message, bot);
            return;
        } else {
            // Single role
            if (first === undefined) {
                this.invalidCMD(message);
                return;
            }

            reqRoles = [first];
        }

        guild?.members
            .fetch({ user: [message.author.id, bot.id] })
            .then((members: Collection<Snowflake, GuildMember>) => {
                const [member, botMember] = members.map((m) => m);

                // Get list of available roles
                const roleList = this.getAvailableRoles(guild, botMember);

                // Assign roles
                const invalidRoles: string[] = [];
                const roles: string[] = [];

                reqRoles.forEach((r: string) => {
                    const role = roleList[r.toLowerCase()];
                    if (role !== undefined) {
                        roles.push(role);
                    } else {
                        invalidRoles.push(r);
                    }
                });

                member?.roles.add(roles);

                if (invalidRoles.length > 0) {
                    message.channel.send(
                        `Couldn't find the following role(s): ${invalidRoles}`
                    );
                }
            });
    }
}

export default RoleCMD;
