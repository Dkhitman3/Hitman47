import { BaseCommand, Command, Message } from '../../Structures'
import { Ship } from '@shineiichijo/canvas-chan'
import { AnyMessageContent } from '@whiskeysockets/baileys'

@Command('marry', {
    description: 'Marries the summoned haigusha',
    usage: 'marry',
    cooldown: 45,
    category: 'weeb',
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async ({ from, sender, reply, message }: Message): Promise<void> => {
        if (!this.handler.haigushaResponse.has(from)) return void reply(`no  haigusha`)
        const { haigusha } = await this.client.DB.getUser(sender.jid)
        if (haigusha.married) {
            const buttons = [
                { buttonId: `${this.client.config.prefix}divorce`, buttonText: { displayText: 'divorce 💔' }, type: 1 },
                { buttonId: `${this.client.config.prefix}marry`, buttonText: { displayText: 'marry 💍' }, type: 1 }
            ]
            const buttonMessage = {
                text: `you are already married💍`,
                footer: 'shelby',
                headerType: 1,
                buttons: buttons
            }
            return void (await this.client.sendMessage(from, buttonMessage, {
                quoted: message
            }))
        }
        const res = this.handler.haigushaResponse.get(from)
        if (!res) return void null
        await this.client.DB.user.updateOne(
            { jid: sender.jid },
            { $set: { 'haigusha.married': true, 'haigusha.data': res } }
        )
        this.handler.haigushaResponse.delete(from)
        const buttonMessage = {
            text: `you are married💍 with ${res.name}`,
            footer: 'Dkhitman47',
            headerType: 1
        }
        return void (await this.client.sendMessage(from, buttonMessage as AnyMessageContent, {
            quoted: message
        }))
    }
}
