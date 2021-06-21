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

interface Params {
    guild: Guild;
    message: Message;
    bot: ClientUser;
}

interface RemoveParams extends Params {
    arg: string;
}

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
                },
                {
                    name: '`--rm <role>`',
                    value: 'Remove an existing role. \n'
                }
            ]
        };

        message.channel.send({ embed: embedObj });
    }

    // List role flag
    private async listRoles(params: Params): Promise<void> {
        const { guild, message, bot } = params;
        const botMember: GuildMember = await guild.members.fetch(bot.id);
        const roleList = this.getAvailableRoles(guild, botMember);

        const rolesStr = Object.keys(roleList)
            .map((r: string) => `[ ${r.toLowerCase()} ]`)
            .join(' ');

        const msg =
            rolesStr == ''
                ? '**No public role available.**'
                : '**Available Roles: ** ```ini\n' + rolesStr + '```';

        message.channel.send(msg);
    }

    // Remove role flag
    private async removeRoles(params: RemoveParams): Promise<void> {
        const { guild, message, bot, arg } = params;

        const members = await guild.members.fetch({
            user: [message.author.id, bot.id]
        });

        const [member, botMember] = await members.map((m) => m);

        // bot role position
        const botHighestPosition = botMember.roles.highest.rawPosition;

        let removeRoleId = '';
        let found = false;

        member.roles.cache.forEach((role: Role) => {
            // Find the role from the argument
            if (role.name.toLowerCase() === arg.toLowerCase()) {
                // Check if bot can remove it or not
                if (botHighestPosition > role.rawPosition) {
                    removeRoleId = role.id;
                } else {
                    message.channel.send(
                        `Not enough permission to remove \`${arg}\` role`
                    );
                }
                found = true;
                return;
            }
        });

        if (found && removeRoleId === '') {
            return;
        } else if (removeRoleId !== '') {
            // try to remove the role
            try {
                await member.roles.remove(removeRoleId);
                message.channel.send(
                    `Successfully removed role: \`${arg.toLowerCase()}\``
                );
            } catch (e) {
                message.channel.send('Something went wrong.');
            }
        } else {
            message.channel.send(`Couldn't find role: \`${arg}\``);
        }
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

    public async execute(message: Message, args: string[]): Promise<void> {
        const first = args.shift();

        let reqRoles: string[] = [];

        const guild = message.guild;
        const bot = guild?.client.user;

        if (!bot) {
            throw new Error('Bot not found.');
        }

        if (!guild) {
            throw new Error('Guild not found.');
        }

        // Check for flags
        switch (first) {
            // Multiple roles assignment flag
            case '--multi':
                if (args.length === 0) {
                    this.invalidCMD(message);
                    return;
                }

                reqRoles = args;
                break;

            // List role flag
            case '--list':
                await this.listRoles({ guild, message, bot });
                return;

            case '--rm':
                if (args.length === 0) {
                    this.invalidCMD(message);
                    return;
                } else if (args.length > 1) {
                    message.channel.send(
                        'Please remove one role at a time, this is to prevent user from removing and adding multiple roles frequently.'
                    );
                    return;
                }
                await this.removeRoles({ guild, message, bot, arg: args[0] });

                return;

            default:
                // Single role
                if (first === undefined) {
                    this.invalidCMD(message);
                    return;
                }

                reqRoles = [first];
                break;
        }

        // Get the member and the bot user
        const members: Collection<Snowflake, GuildMember> =
            await guild?.members.fetch({ user: [message.author.id, bot.id] });

        const [member, botMember] = members.map((m) => m);

        // Get list of available roles
        const roleList = this.getAvailableRoles(guild, botMember);

        // Assign roles
        const invalidRoles: string[] = [];
        const roles: string[] = [];
        const rolesAdded: string[] = [];
        const rolesAlreadyPresent: string[] = [];

        // Roles of the member
        const memberRoles: RoleList = {};

        member.roles.cache.forEach((role: Role) => {
            memberRoles[role.name.toLowerCase()] = role.id;
        });

        reqRoles.forEach((r: string) => {
            const roleName = r.toLowerCase();
            const role = roleList[roleName];
            if (role !== undefined) {
                // Check for already existing role
                if (!memberRoles[roleName]) {
                    roles.push(role);
                    rolesAdded.push(roleName);
                } else {
                    rolesAlreadyPresent.push(r);
                }
            } else {
                invalidRoles.push(r);
            }
        });

        try {
            await member?.roles.add(roles);

            const successRoles = rolesAdded.map((r) => `\`${r}\``).join(', ');
            const errorRoles = invalidRoles.map((r) => `\`${r}\``).join(', ');
            const alreadyOwnedRoles = rolesAlreadyPresent
                .map((r) => `\`${r}\``)
                .join(', ');

            let msg = '';
            // Success Message
            if (roles.length > 0) {
                msg += `Successfully added role(s): ${successRoles}\n`;
            }

            // Error message
            if (invalidRoles.length > 0) {
                msg += `Couldn't find the following role(s): ${errorRoles}\n`;
            }

            if (rolesAlreadyPresent.length > 0) {
                msg += `You already have the role(s): ${alreadyOwnedRoles}\n`;
            }
            message.channel.send(msg);
        } catch (err) {
            message.channel.send('Something went wrong.');
        }
    }
}

export default RoleCMD;
