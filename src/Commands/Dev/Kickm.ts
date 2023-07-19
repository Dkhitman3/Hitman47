import { BaseCommand, Command, Message } from '../../Structures'

@Command('kickm', {
    description: 'mod can remove people without being an admin',
    aliases: ['k'], 
    category: 'dev',
    usage: 'kickm',
    cooldown: 3,
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (!M.groupMetadata) return void M.reply('*Try Again!*')
        const users = M.mentioned
        if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)
        if (!this.client.config.mods.includes(M.sender.jid)) return void M.reply('only mods')
        const mentioned = users
        let text = ''
        for (const user of users) {
            const i = users.indexOf(user)
            if (i === 0) text += '\n'
            if (user === M.groupMetadata.owner || '') {
                text += `Skipped @${user.split('@')[0]} as they're the owner`
                continue
            }
            await this.client.groupParticipantsUpdate(M.from, [user], 'remove')
            text += `🟥removed by mod @${user.split('@')[0]}`
        }
        return void M.reply(text, 'text', undefined, undefined, undefined, mentioned)
    }
}
