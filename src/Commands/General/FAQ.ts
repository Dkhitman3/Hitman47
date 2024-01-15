import { BaseCommand, Command, Message } from '../../Structures';

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

        const footerText = '© Hitman47 Inc 2024';

        return void (await this.client.sendMessage(from, {
            text: faqText,
            footer: footerText,
            headerType: 1
        }, {
            quoted: message
        }));
    }
}
