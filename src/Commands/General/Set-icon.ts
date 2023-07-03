import { BaseCommand, Command, Message } from '../../Structures'
import { tmpdir } from 'os'
import { writeFile, createReadStream, unlink } from 'fs-extra'
import { ImgurClient, ImgurApiResponse } from 'imgur'
import { proto } from '@whiskeysockets/baileys'

@Command('set-icon', {
    description: 'Sets the icon of a user',
    usage: 'set-icon [quote/caption video/image/gif]',
    category: 'general',
    exp: 35,
    cooldown: 45,
    aliases: ['set-pfp']
})
export default class command extends BaseCommand {
    override execute = async ({
        sender,
        quoted,
        hasSupportedMediaMessage,
        reply,
        downloadMediaMessage,
        message,
        type
    }: Message): Promise<void> => {
        if ((!hasSupportedMediaMessage && !quoted) || (!hasSupportedMediaMessage && !quoted?.hasSupportedMediaMessage))
            return void reply(`🟥 *Provide the image/video/gif you wanna set as your icon by quoting/captioning*`)
        let buffer!: Buffer
        let messageType: 'image' | 'video' = 'image'
        if (hasSupportedMediaMessage) {
            if (type === 'videoMessage' && (message.message?.videoMessage?.seconds as number) > 45)
                return void reply(`🟥 *The duration of video should not be longer than 45 seconds*`)
            if (type === 'videoMessage') messageType = 'video'
            buffer = await downloadMediaMessage(message.message as proto.IMessage)
        } else {
            if (quoted?.type === 'videoMessage' && (quoted?.message.videoMessage?.seconds as number) > 45)
                return void reply(`🟥 *The duration of video should not be longer than 45 seconds*`)
            if (quoted?.type === 'videoMessage') messageType = 'video'
            buffer = await downloadMediaMessage(quoted?.message as proto.IMessage)
        }
        const imgurClient = new ImgurClient({
            clientId: '7761afca6a3fe8b'
        })
        let data: ImgurApiResponse['data']
        if (messageType === 'video') {
            const filename = `${tmpdir()}/${Math.random().toString(36)}.mp4`
            await writeFile(filename, buffer)
            const upload = await imgurClient.upload({
                image: createReadStream(filename) as any,
                type: 'stream'
            })
            data = upload.data
            setTimeout(async () => await unlink(filename), 300 * 1000)
        } else {
            const upload = await imgurClient.upload({
                image: buffer
            })
            data = upload.data
        }
        const icon = {
            custom: true,
            url: data.link,
            hash: data.deletehash as string
        }
        const info = await this.client.DB.getUser(sender.jid)
        if (info.icon.custom) await imgurClient.deleteImage(info.icon.hash as string)
        await this.client.DB.updateUser(sender.jid, 'icon', 'set', icon)
        return void reply(
            `🟩 *Successfully changed your icon*. Use *${this.client.config.prefix}profile* to check it out`
        )
    }
}
