import { BaseCommand, Command, Message } from '../../Structures'

@Command('delete', {
    description: '',
    category: 'moderation',
    usage: '',
    exp: 10,
    cooldown: 10,
    aliases: ['del']
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (!M.quoted) return void M.reply('message?')
        const bot = this.client.correctJid(this.client.user?.id || '')
        if (M.quoted.sender.jid !== bot) return void M.reply('tag my message, not someone')
        return void (await this.client.sendMessage(M.from, {
            delete: M.quoted.key
        }))
    }
}
