import { BaseCommand, Command, Message } from '../../Structures'

@Command('reset-bio', {
    category: 'general',
    aliases: ['reset-about', 'delete-bio', 'delete-about'],
    usage: 'reset-bio',
    description: 'Resets the bio of the user (if the bio is set to custom)',
    exp: 10,
    cooldown: 10
})
export default class command extends BaseCommand {
    override execute = async ({ sender, reply }: Message): Promise<void> => {
        let { about } = await this.client.DB.getUser(sender.jid)
        if (!about.custom) return void reply("🟥 *Your bio can't be reset as your bio is not set to custom*")
        about = {
            custom: false
        }
        await this.client.DB.user.updateOne({ jid: sender.jid }, { $set: { about } })
        return void reply('🟩 *Your bio has now been reset*')
    }
}
