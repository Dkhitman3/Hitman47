import { BaseCommand, Command, Message } from '../../Structures'

@Command('reset-username', {
    category: 'general',
    aliases: ['reset-name', 'delete-username', 'delete-name'],
    usage: 'reset-username',
    description: 'Resets the username of the user (if the username is set to custom)',
    exp: 10,
    cooldown: 10
})
export default class command extends BaseCommand {
    override execute = async ({ sender, reply }: Message): Promise<void> => {
        let { username } = await this.client.DB.getUser(sender.jid)
        if (!username.custom)
            return void reply("🟥 *Your username can't be reset as your username is not set to custom*")
        username = {
            custom: false
        }
        await this.client.DB.user.updateOne({ jid: sender.jid }, { $set: { username } })
        return void reply('🟩 *Your username has now been reset*')
    }
}
