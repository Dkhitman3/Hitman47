import { BaseCommand, Command, Message } from '../../Structures'
import { ImgurClient } from 'imgur'

@Command('reset-icon', {
    category: 'general',
    aliases: ['reset-pfp', 'delete-icon', 'delete-pfp'],
    usage: 'reset-icon',
    description: 'Resets the icon (or pfp) of the user (if the icon is set to custom)',
    exp: 10,
    cooldown: 20
})
export default class command extends BaseCommand {
    override execute = async ({ sender, reply }: Message): Promise<void> => {
        let { icon } = await this.client.DB.getUser(sender.jid)
        if (!icon.custom) return void reply("🟥 *Your icon can't be reset as your icon is not set to custom*")
        const imgurClient = new ImgurClient({
            clientId: '7761afca6a3fe8b'
        })
        await imgurClient.deleteImage(icon.hash as string)
        icon = {
            custom: false
        }
        await this.client.DB.updateUser(sender.jid, 'icon', 'set', icon)
        return void reply('🟩 *Your icon has now been reset*')
    }
}
