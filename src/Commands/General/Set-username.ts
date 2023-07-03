import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('set-username', {
    description: 'Sets the username of a user',
    category: 'general',
    usage: 'set-username [new_username]',
    cooldown: 15,
    exp: 20,
    aliases: ['set-name']
})
export default class command extends BaseCommand {
    override execute = async ({ sender, reply }: Message, { context }: IArgs) => {
        if (!context) return void reply('🟥 *Provide the username that you want to set for yourself*')
        const term = context.trim()
        let { username } = await this.client.DB.getUser(sender.jid)
        if (username?.custom && username?.name === term)
            return void reply(
                `🟨 There\'s no need for you to change your username as your username\'s already set to *"${term}"*`
            )
        if (term.length > 30)
            return void reply("🟥 *The username shouldn't have more than 30 letters (including space)*")
        username = {
            custom: true,
            name: term
        }
        await this.client.DB.user.updateOne({ jid: sender.jid }, { $set: { username } })
        return void reply(`🟩 Successfully changed your username to *${username?.name}*`)
    }
}
