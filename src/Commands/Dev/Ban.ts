import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('ban', {
    description: 'Bans the tagged or quoted user',
    category: 'dev',
    usage: 'ban [tag/quote users]'
})
export default class command extends BaseCommand {
    override execute = async (
        { reply, quoted, mentioned, from, sender, groupMetadata }: Message,
        { context }: IArgs
    ): Promise<void> => {
        if (!groupMetadata) return void reply('*Try Again!*')
        const users = mentioned
        if (quoted && !users.includes(quoted.sender.jid)) users.push(quoted.sender.jid)
        if (users.length <= 0) return void reply('Tag or quote a user to ban with the reason')
        const { ban } = await this.client.DB.getUser(users[0])
        if (ban?.banned)
            return void reply(
                `🟥 *@${users[0].split('@')[0]}* is already 🟥banned by *${ban.bannedBy}* in *${ban.bannedIn} ${
                    ban.time
                } (GMT)*. ❓ Reason: *${ban.reason}*`,
                'text',
                undefined,
                undefined,
                undefined,
                [users[0]]
            )
        if (!context)
            return void reply(`Provide the reason to ban. Example - *${this.client.config.prefix}ban @user | reason*`)
        const reason = context.trim().split('|')[1]
        if (!reason)
            return void reply(`Provide the reason to ban. Example - *${this.client.config.prefix}ban @user | reason*`)
        const { subject } = groupMetadata
        await this.client.DB.banUser(users[0], sender.username, subject, reason.trim())
        return void reply(
            `*@${users[0].split('@')[0]}* is now 🟥banned from using commands. Reason: *${reason.trim()}*`,
            'text',
            undefined,
            undefined,
            undefined,
            [users[0]]
        )
    }
    }

