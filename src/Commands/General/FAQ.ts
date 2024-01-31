import { BaseCommand, Command, Message } from '../../Structures';

interface CustomMessageContent {
    text: string;
    footer: string;
    headerType?: number; 
}

@Command('faq', {
    description: '',
    usage: 'faq',
    category: 'general',
    exp: 10,
    cooldown: 10
})
export default class command extends BaseCommand {
    override execute = async ({ from, sender, message }: Message): Promise<void> => {
        const faqText = `*━━━❰ FAQ ❱━━━*\n\n... [Your FAQ text] ...\nᚖ ────── ✪ ────── ᚖ`;

        const footerText = '© Godspeed Inc 2024';

        const messageContent: CustomMessageContent = {
            text: faqText,
            footer: footerText,
            headerType: 1
        };

        return void (await this.client.sendMessage(from, messageContent, {
            quoted: message
        }));
    }
 }
