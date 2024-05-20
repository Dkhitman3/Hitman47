import { YT } from '../../lib'
import { Message, Command, BaseCommand } from '../../Structures'
import { IArgs } from '../../Types'

@Command('ytv', {
    description: 'Downloads and sends the video of the provided YouTube video link with views, uploaded date, and URL',
    cooldown: 10,
    category: 'media',
    exp: 25,
    usage: 'ytv [link] --quality=[low/medium/high]',
    aliases: ['ytvideo']
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { flags }: IArgs): Promise<void> => {
        try {
            const urls = M.urls.filter((url) => url.includes('youtube.com') || url.includes('youtu.be'))
            if (!urls.length) return void M.reply('Provide a YouTube video URL to download, Baka!')

            const url = urls[0]
            const { validate, download, getInfo } = new YT(url)
            if (!validate()) return void M.reply('Provide a valid YouTube video URL, Baka!')

            flags = flags.filter((flag) => flag.startsWith('--quality='))
            const qualities = ['low', 'medium', 'high']
            const quality = (
                flags[0] && flags[0].split('=')[1] !== '' && qualities.includes(flags[0].split('=')[1].toLowerCase())
                    ? flags[0].split('=')[1].toLowerCase()
                    : 'medium'
            ) as 'low' | 'medium' | 'high'

            const { videoDetails } = await getInfo()
            if (Number(videoDetails.lengthSeconds) > 1800) return void M.reply('The video is too long to send')

            const videoBuffer = await download(quality)
            if (!videoBuffer) return void M.reply('Failed to download the video, please try again.')

            const text = `📍 *Title:* ${videoDetails.title}\n🎬 *Channel:* ${videoDetails.author.name}\n🎞️ *Duration:* ${videoDetails.lengthSeconds}s\n👁️ *Views:* ${videoDetails.viewCount}\n📅 *Uploaded:* ${new Date(videoDetails.uploadDate).toDateString()}\n🔗 *URL:* ${videoDetails.video_url}\n🌴 *Description:* ${videoDetails.description}`

            await M.reply(text)  // von strucker

            await M.reply(
                videoBuffer,
                'document',
                undefined,
                'video/mp4',
                undefined,
                undefined,
                undefined,
                await this.client.utils.getBuffer(videoDetails.thumbnails[0].url),
                `${videoDetails.title}.mp4`
            )
        } catch (error) {
            console.error('Error executing ytv command:', error)
            await M.reply('An error occurred while processing your request.')
        }
    }
                    }
                
