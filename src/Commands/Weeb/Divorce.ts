import { BaseCommand, Command, Message } from '../../Structures'

@Command('divorce', {
    description: 'Divorce',
    cooldown: 45,
    exp: 10,
    category: 'weeb',
    usage: 'divorce'
})
export default class command extends BaseCommand {
    override execute = async ({ from, sender, reply, message }: Message): Promise<void> => {
        const { haigusha } = await this.client.DB.getUser(sender.jid)
        if (!haigusha.married) return void reply('u r single')
        const buttons = [
            { buttonId: `${this.client.config.prefix}dk`, buttonText: { displayText: 'dk 🎉' }, type: 1 },
            { buttonId: `${this.client.config.prefix}haigusha`, buttonText: { displayText: 'haigusha 😻' }, type: 1 }
        ]
        const buttonMessage = {
            text: `divorced ${haigusha.data.name}`,
            headerType: 1,
            footer: 'Dkhitman47',
            buttons: buttons
        }
        await this.client.DB.user.updateOne(
            { jid: sender.jid },
            { $set: { 'haigusha.married': false }, $unset: { 'haigusha.data': '' } }
        )
        return void (await this.client.sendMessage(from, buttonMessage, { quoted: message }))
    }
}
