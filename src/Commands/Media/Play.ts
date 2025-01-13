import { Command, BaseCommand, Message } from '../../Structures';
import axios from 'axios'; // Import axios
import { IArgs } from '../../Types';

interface Video {
    url: string;
    title: string;
    thumbnail: string;
    description: string;
}

@Command('play', {
    description: 'Plays a song of the given term from YouTube',
    cooldown: 15,
    exp: 35,
    dm: true,
    category: 'media',
    usage: 'play [term]'
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void M.reply('Provide a term to play, Baka!');
        const term = context.trim();

        try {
            // Search for videos using the YouTube search API
            const videos: Video[] = await this.client.utils.fetch(`https://api.dreaded.site/api/ytsearch?query=${term}`);
            if (!videos || !videos.length) return void M.reply(`No matching songs found | *"${term}"*`);

            // Use the provided download API to get the audio URL
            const videoUrl = videos[0].url;
            const { data } = await axios.get(`https://api.dreaded.site/api/ytdl/audio?url=${videoUrl}`);

            // Fetch the audio buffer
            const buffer = await this.client.utils.getBuffer(data.url);

            // Send the audio response
            return void (await M.reply(buffer, 'audio', undefined, 'audio/mpeg', undefined, undefined, {
                title: videos[0].title,
                thumbnail: await this.client.utils.getBuffer(videos[0].thumbnail),
                mediaType: 2,
                body: videos[0].description,
                mediaUrl: videos[0].url
            }));
        } catch (error) {
            console.error(error);
            return void M.reply('An error occurred while processing your request. Please try again later.');
        }
    };
}
