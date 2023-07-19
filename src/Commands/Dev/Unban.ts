import { BaseCommand, Command, Message } from '../../Structures'

@Command('unban', {
    description: 'Unbans a user',
    category: 'dev',
    usage: 'unban [tag/quote users]'
})
export default class command extends BaseCommand {
    override execute = async ({ mentioned, quoted, reply }: Message): Promise<void> => {
        const users = mentioned
        const arr: string[] = []
        if (quoted && !users.includes(quoted.sender.jid)) users.push(quoted.sender.jid)
        if (users.length <= 0) return void reply(`🟥 *Tag/quote a user to unban*`)
        let text = '🟩 Unbanned:\n'
        for (const user of users) {
            const { ban } = await this.client.DB.getUser(user)
            if (!ban?.banned) {
                reply(
                    `🟨 Skipped *@${user.split('@')[0]}* as he's already unbanned`,
                    'text',
                    undefined,
                    undefined,
                    undefined,
                    [user]
                )
                continue
            }
            await this.client.DB.unbanUser(user)
            text += `\n*@${user.split('@')[0]}*`
            arr.push(user)
        }
        return void reply(text, 'text', undefined, undefined, undefined, arr)
    }
                                   }

