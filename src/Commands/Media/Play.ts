import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs, YT_Search } from '../../Types'
import axios from 'axios' // Add axios for handling the request

@Command('play', {
    description: 'Plays a song of the given term from YouTube',
    cooldown: 15,
    exp: 35,
    category: 'media',
    usage: 'play [term]'
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void M.reply('Provide a term to play, Baka!')
        const term = context.trim()

        // Fetch YouTube videos based on the search term
        const videos = await this.client.utils.fetch<YT_Search[]>(`https://weeb-api.vercel.app/ytsearch?query=${term}`)
        if (!videos || !videos.length) return void M.reply(`No matching songs found | *"${term}"*`)

        // Use the new API to download the video audio
        const downloadUrl = `https://ironman.koyeb.app/ironman/dl/ytdl2?url=${videos[0].url}`
        
        // Fetch the audio file as a buffer
        const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' }) // Use axios to get raw binary data
        const buffer = Buffer.from(response.data) // Convert the response to a buffer

        if (!buffer) return void M.reply('Failed to download the song, please try again later.')

        // Reply with the audio and metadata
        return void (await M.reply(buffer, 'audio', undefined, 'audio/mpeg', undefined, undefined, {
            title: videos[0].title,
            thumbnail: await this.client.utils.getBuffer(videos[0].thumbnail),
            mediaType: 2,
            body: videos[0].description,
            mediaUrl: videos[0].url
        }))
    }
}
