import { Command, BaseCommand, Message } from '../../Structures'
import axios from 'axios'; // Import axios
import { IArgs } from '../../Types'

// Define the structure for Video and DownloadData
interface Video {
    url: string;
    title: string;
    thumbnail: string;
    description: string;
}

interface DownloadData {
    data: {
        url: string;
    };
}

@Command('play', {
    description: 'Plays a song of the given term from YouTube',
    cooldown: 15,
    exp: 35,
    category: 'media',
    usage: 'play [term]'
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void M.reply('Provide a term to play, Baka!');
        const term = context.trim();
        
        // Fetch videos and ensure they are typed correctly
        const videos: Video[] = await this.client.utils.fetch(`${this.client.config.API_URL}ytsearch?query=${term}`);
        if (!videos || !videos.length) return void M.reply(`No matching songs found | *"${term}"*`);
        
        // Fetch download data and type it correctly
        const { data }: { data: DownloadData } = await axios.get(`${this.client.config.API_URL}download?url=${videos[0].url}&type=audio`);
        const buffer = await this.client.utils.getBuffer(data.data.url);
        
        // Send the audio buffer with metadata
        return void (await M.reply(buffer, 'audio', undefined, 'audio/mpeg', undefined, undefined, {
            title: videos[0].title,
            thumbnail: await this.client.utils.getBuffer(videos[0].thumbnail),
            mediaType: 2,
            body: videos[0].description,
            mediaUrl: videos[0].url
        }));
    }
}
