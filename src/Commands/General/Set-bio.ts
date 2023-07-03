import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('set-bio', {
    description: 'Sets the bio of a user',
    category: 'general',
    usage: 'set-bio [new_bio]',
    aliases: ['set-about'],
    exp: 20,
    cooldown: 15
})
export default class command extends BaseCommand {
    override execute = async ({ sender, reply }: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void reply('🟥 *Provide the bio that you want to set for yourself*')
        const about = {
            custom: true,
            bio: context.trim()
        }
        await this.client.DB.user.updateOne({ jid: sender.jid }, { $set: { about } })
        return void reply('🟩 *Successfully changed your bio with the given one*')
    }
}
