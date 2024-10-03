import { YT } from '../../lib'
import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs, YT_Search } from '../../Types'

@Command('play', {
    description: 'Plays a song of the given term from YouTube',
    cooldown: 15,
    exp: 35,
    category: 'media',
    usage: 'play [term]',
    aliases: ['aud']
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void M.reply('Provide a term to play, Baka!')
        const term = context.trim()

        // Fetch video information from the new API
        const videoResponse = await this.client.utils.fetch<YT_Search>(`https://ironman.koyeb.app/ironman/dl/ytdl2?url=${term}`)
        if (!videoResponse || !videoResponse.url) return void M.reply(`No matching songs found | *"${term}"*`)

        // Download the audio using the new API response
        const buffer = await new YT(videoResponse.url, 'audio').download()

        const coolestMessages = [
            '*Get ready to groove! Here comes your song...*',
            '*Hold on tight, the beats are about to drop!*',
            '*Your jam is on its way, prepare to dance!*',
            '*Crank up the volume! Your song is here!*',
            '*Incoming vibes! Enjoy your tune...*'
        ]

        const randomMessage = coolestMessages[Math.floor(Math.random() * coolestMessages.length)]

        M.reply(randomMessage)

        // Get the thumbnail buffer
        const thumbnailBuffer = await this.getBuffer(videoResponse.thumbnail)

        return void (await M.reply(buffer, 'audio', undefined, 'audio/mpeg', undefined, undefined, {
            title: videoResponse.title,
            thumbnail: thumbnailBuffer,
            mediaType: 2,
            body: videoResponse.description,
            mediaUrl: videoResponse.url
        }))
    }

    // Helper function to get buffer from a URL
    private async getBuffer(url: string): Promise<Buffer> {
        const response = await this.client.utils.fetch(url, { responseType: 'arraybuffer' })
        return Buffer.from(response, 'binary')
    }
}
