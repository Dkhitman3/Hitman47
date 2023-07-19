import { BaseCommand, Command, Message } from '../../Structures'
import { proto } from '@whiskeysockets/baileys'
import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas'

@Command('thug-life', {
    description: 'Recreates the thug life meme',
    category: 'fun',
    exp: 30,
    cooldown: 25,
    usage: 'thug-life [tag/quote users]'
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
        const greyscale = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
            const data = ctx.getImageData(x, y, width, height)
            for (let i = 0; i < data.data.length; i += 4) {
                const brightness = 0.34 * data.data[i] + 0.5 * data.data[i + 1] + 0.16 * data.data[i + 2]
                data.data[i] = brightness
                data.data[i + 1] = brightness
                data.data[i + 2] = brightness
            }
            ctx.putImageData(data, x, y)
            return ctx
        }
        const base = await loadImage(this.client.assets.get('thug-life') as Buffer)
        const data = await loadImage(buffer)
        const canvas = createCanvas(data.width, data.height)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(data, 0, 0)
        greyscale(ctx, 0, 0, data.width, data.height)
        const ratio = base.width / base.height
        const width = data.width / 2
        const height = Math.round(width / ratio)
        ctx.drawImage(base, data.width / 2 - width / 2, data.height - height, width, height)
        return void (await M.reply(canvas.toBuffer(), 'image'))
    }
}
