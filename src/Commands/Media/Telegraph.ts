import { BaseCommand, Command, Message } from '../../Structures';
import axios from 'axios';

@Command('telegram', {
    description: 'Download Telegram content',
    category: 'media',
    usage: 'telegram <Telegram file URL>',
    aliases: ['tg'],
    exp: 20,
    cooldown: 1
})
export default class extends BaseCommand {
    public override execute = async ({ reply, urls }: Message): Promise<void> => {
        if (!urls || !urls.length) {
            return void (await reply('❌ Please provide a Telegram file URL'));
        }

        const [url] = urls;
        if (!url.includes('t.me')) {
            return void (await reply('❌ Wrong URL! Only Telegram file URLs can be downloaded'));
        }

        try {
            const fileId = this.extractFileIdFromUrl(url);
            const fileUrl = await this.getFileUrl(fileId);

            const buffer = await this.client.utils.getBuffer(fileUrl);
            await reply(buffer, 'file'); // Adjust type based on the actual content type

        } catch (error: any) {
            await reply(`❌ Error while getting file data: ${(error as Error).message}`);
        }
    };

    private extractFileIdFromUrl(url: string): string {
        // Implement logic to extract the file ID from the URL
        // For example: https://t.me/{channel_username}/{message_id}/{file_id}
        // Extract the file ID using regular expressions or other suitable methods
    }

    private async getFileUrl(fileId: string): Promise<string> {
        const botToken = 'YOUR_TELEGRAM_BOT_TOKEN';
        const { data } = await axios.get(
            `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
        );

        if (data.ok && data.result) {
            return `https://api.telegram.org/file/bot${botToken}/${data.result.file_path}`;
        } else {
            throw new Error('Failed to retrieve file URL from Telegram API');
        }
    }
}
