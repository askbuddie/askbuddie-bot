import {
    ClientUser,
    Collection,
    Guild,
    GuildMember,
    Message,
    MessageEmbed,
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

interface RoleToMultiMembersParams {
    role: string;
    bot: ClientUser;
    guild: Guild;
    message: Message;
    remove: boolean;
}

interface RemoveParams extends Params {
    arg: string;
}

interface CountParams extends Params {
    args: string[];
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
                },
                {
                    name: '`--count [<role>]`',
                    value: 'Count online members in one or all roles. \n'
                }
            ]
        };

        message.channel.send({ embed: embedObj });
    }

    // List role flag
    private async listRoles(params: Params): Promise<void> {
        const { guild, message, bot } = params;
        const botMember: GuildMember = await guild.members.fetch(bot.id);
        const roleList = Object.keys(
            this.getAvailableRoles(guild, botMember)
        ).sort();

        if (roleList.length === 0) {
            message.channel.send('**No public role available.**');
            return;
        }

        const [leftColumn, rightColumn] = [
            roleList.splice(0, roleList.length / 2),
            roleList
        ];
        const invisibleSeparator = '⁣'; // it is NOT an empty string
        const embed = new MessageEmbed({
            color: 0x003dbe,
            fields: [
                {
                    inline: true,
                    name: invisibleSeparator,
                    value: leftColumn.join('\n')
                }
            ],
            title: 'Available Roles'
        });
        if (rightColumn.length > 0) {
            embed.addField(invisibleSeparator, rightColumn.join('\n'), true);
        }

        message.channel.send(embed);
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

    private getBotRolePosition(botMember: GuildMember): number {
        // Get bot role position
        let botHighestPosition = 0;
        const botRole = botMember.roles.highest;
        if (botRole !== undefined) {
            botHighestPosition = botRole.rawPosition;
        }
        return botHighestPosition;
    }

    private getAvailableRoles(guild: Guild, botMember: GuildMember): RoleList {
        const botHighestPosition = this.getBotRolePosition(botMember);

        // List of guild roles
        const roleList: RoleList = {};
        guild?.roles.cache.forEach((role: Role) => {
            // get list a roles below the bot role, ignore the role @everyone and ignore those it can't edit, which are probably other bot's roles
            if (this.isAssignableRole(role, botHighestPosition))
                roleList[role.name.toLowerCase()] = role.id;
        });

        return roleList;
    }

    // check if role is below the bot role, ignore the role @everyone and ignore those it can't edit, which are probably other bot's roles
    private isAssignableRole(role: Role, botHighestPosition: number): boolean {
        return (
            botHighestPosition > role.rawPosition &&
            role.name.toLowerCase() !== '@everyone' &&
            role.editable
        );
    }

    // Role count command
    private async countCMD(params: CountParams): Promise<void> {
        const { guild, message, bot, args } = params;
        const botMember: GuildMember = await guild.members.fetch(bot.id);

        const botHighestPosition = this.getBotRolePosition(botMember);

        // Get available roles
        const roles: Collection<string, Role> = guild?.roles.cache.filter(
            (role: Role) => {
                if (this.isAssignableRole(role, botHighestPosition)) {
                    return true;
                }
                return false;
            }
        );

        // count members of all roles
        if (args.length === 0) {
            const field = { name: '\u200b', value: '' };
            if (roles.size === 0) {
                const msg = 'No public role available.';
                message.channel.send(msg);
                return;
            } else {
                roles.map((role: Role) => {
                    field.value += `**${role.name}** : \`${role.members.size}\`\n`;
                });
            }
            const embedObj = {
                title: 'Online members count by role: \n',
                color: '#e53935',
                fields: [field]
            };
            message.channel.send({ embed: embedObj });
        } else {
            // count members of requested role
            let found = false;

            roles.every((role: Role) => {
                // found required role
                if (args[0].toLowerCase() === role.name.toLowerCase()) {
                    message.channel.send(
                        `Total online members in role **${role.name}** : \`${role.members.size}\``
                    );
                    found = true;
                    return false;
                }

                return true;
            });

            if (!found) {
                message.channel.send(`Role not found.`);
            }
        }
    }

    // admin command
    // add a role to multiple members
    private async roleToMultiMembers(params: RoleToMultiMembersParams) {
        const { role, bot, guild, message, remove } = params;

        const textChannel = message.channel;
        const members = message.mentions.members;
        const executor = message.member;

        // check if the message is coming from a guild
        if (!executor) {
            textChannel.send('This command can only be used in a server!');
            return;
        }

        const botMember = await guild?.members.fetch({ user: bot.id });

        // check permission of the author
        if (
            !this.isAssignableRole(
                executor?.roles.highest,
                this.getBotRolePosition(botMember)
            ) &&
            !(executor.user.id === guild.ownerID)
        ) {
            textChannel.send('You do not have permission to use this command!');
            return;
        }

        const roleList = this.getAvailableRoles(guild, botMember);

        // TODO: remove roles command
        if (!(role.toLowerCase() in roleList)) {
            textChannel.send(
                `Cannot ${remove ? 'remove' : 'assign'} role ${role}.`
            );
            return;
        }

        const roleId = roleList[role.toLowerCase()];

        const successMembers: GuildMember[] = [];
        const failedMembers: GuildMember[] = [];

        if (!members) {
            textChannel.send('Invalid members!');
            return;
        }

        // assign roles to the user
        await Promise.all(
            members?.map(async (member: GuildMember) => {
                try {
                    if (remove) {
                        await member.roles.remove(roleId);
                    } else {
                        await member.roles.add(roleId);
                    }
                    successMembers.push(member);
                } catch (err) {
                    failedMembers.push(member);
                }
                return;
            })
        );

        let msg = '';

        if (successMembers.length > 0) {
            if (remove) {
                msg += `Role ${role} removed successfully from following member(s): `;
            } else {
                msg += `Role ${role} added successfully to following member(s): `;
            }
            msg += successMembers
                .map((member) => member.displayName)
                .join(', ');
            msg += '\n';
        }

        if (failedMembers.length > 0) {
            if (remove) {
                msg += `Could not remove role ${role} from following members: `;
            } else {
                msg += `Could not assign role ${role} to following members: `;
            }
            msg += failedMembers.map((member) => member.displayName).join(', ');
            msg += '\n';
        }

        textChannel.send(msg);
    }

    // this function is executed first when role command is used
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

            // remove role flag
            case '--rm':
                if (args.length === 0) {
                    this.invalidCMD(message);
                    return;
                } else if (args.length > 1) {
                    if (
                        message.mentions.members &&
                        message.mentions.members.size > 0
                    ) {
                        await this.roleToMultiMembers({
                            role: args[0],
                            bot: bot,
                            guild: guild,
                            message: message,
                            remove: true
                        });
                        return;
                    }
                    message.channel.send(
                        'Please remove one role at a time, this is to prevent user from removing and adding multiple roles frequently.'
                    );
                    return;
                }
                await this.removeRoles({ guild, message, bot, arg: args[0] });

                return;

            // count role flag
            case '--count':
                this.countCMD({ guild, message, bot, args });
                return;

            default:
                // Single role
                if (first === undefined) {
                    this.invalidCMD(message);
                    return;
                }

                reqRoles = [first];

                // check for admin adding role to multiple users
                if (args.length > 0) {
                    await this.roleToMultiMembers({
                        role: first,
                        bot: bot,
                        guild: guild,
                        message: message,
                        remove: false
                    });
                    return;
                }

                break;
        }

        // Get the member and the bot user
        const members: Collection<Snowflake, GuildMember> =
            await guild?.members.fetch({ user: [message.author.id, bot.id] });

        const [user, buddiebot] = members.partition((m) => !m.user.bot);

        const [member] = user.values();
        const [botMember] = buddiebot.values();

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
