import { BaseCommand, Command, Message } from '../../Structures'
import { proto } from '@whiskeysockets/baileys'
import { createCanvas, loadImage } from 'canvas'

@Command('brazzers', {
    description: 'Well',
    category: 'fun',
    exp: 30,
    cooldown: 25,
    usage: 'brazzers [tag/quote users]'
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        let buffer!: Buffer
        if (M.type === 'imageMessage') buffer = await M.downloadMediaMessage(M.message.message as proto.IMessage)
        if (M.quoted && M.quoted.type === 'imageMessage') buffer = await M.downloadMediaMessage(M.quoted.message)
        if (M.quoted && M.quoted.type !== 'imageMessage')
            buffer = await this.client.utils.getBuffer(
                (await this.client.profilePictureUrl(M.quoted.sender.jid, 'image')) || ''
            )
        if (!M.quoted && M.type !== 'imageMessage' && M.mentioned.length >= 1)
            buffer = await this.client.utils.getBuffer(
                (await this.client.profilePictureUrl(M.mentioned[0], 'image')) || ''
            )
        if (!M.quoted && M.type !== 'imageMessage' && M.mentioned.length < 1)
            buffer = await this.client.utils.getBuffer(
                (await this.client.profilePictureUrl(M.sender.jid, 'image')) || ''
            )
        if (!buffer) return void M.reply('*Provide an image*')
        const data = await loadImage(buffer)
        const base = await loadImage(this.client.assets.get('brazzers') as Buffer)
        const canvas = createCanvas(data.width, data.height)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(data, 0, 0)
        const ratio = base.width / base.height
        const width = data.width / 3
        const height = Math.round(width / ratio)
        ctx.drawImage(base, 0, data.height - height, width, height)
        return void (await M.reply(canvas.toBuffer(), 'image'))
    }
}
