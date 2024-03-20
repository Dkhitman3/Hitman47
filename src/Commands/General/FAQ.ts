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
        const faqText = `*━━━❰ FAQ ❱━━━*\n\n

📮 *Q1:* How do I add *MARIA BOT* in my group?
📑 *A:* Send the group link in the bot's or owner's DM & it will join soon.
ᚖ ────── ✪ ────── ᚖ

📮 *Q2:* What are the requirements for the bot to join a group?
📑 *A:* First the group must have atleast 50 members for the bot to join & the group must be active & also be a non-hentai/porn group.
ᚖ ────── ✪ ────── ᚖ

📮 *Q3:* How do I earn XP in the group?
📑 *A:* By earning XP you will need to use commands of the bot like reaction command & others.
ᚖ ────── ✪ ────── ᚖ

📮 *Q4:* Can the bot work in personal message?
📑 *A:* Yes, but ONLY stickers command will work otherwise you're recommended to use the bot in groups only.
ᚖ ────── ✪ ────── ᚖ

📮 *Q5:* Can I call the bot?
📑 *A:* Calling the bot is at your own pleasure but with consequences thus you will be blocked & banned instantly for calling the bot!
ᚖ ────── ✪ ────── ᚖ

📮 *Q6:* Where can I find Maria bot?
📑 *A:* Lucy is one of the bots owned by *➳ᴹᴿ᭄𝐉𝐅𝐋𝐄𝐗*. Incase you need other bots, use the command /support & you will get support group link in your DM.
ᚖ ────── ✪ ────── ᚖ

📮 *Q7:* Can you hire a bot from *➳ᴹᴿ᭄𝐉𝐅𝐋𝐄𝐗*
📑 *A:* Based on the copyrights, we don't hire bots to anyone thus the bots are free to use.
ᚖ ────── ✪ ────── ᚖ

📮 *Q8:* Why is the bot not working in my group?
📑 *A:* There are 3 main reasons for that, either the bot is lagging due to data traffic, inactive or the bot has been banned.
ᚖ ────── ✪ ────── ᚖ

📮 *Q9:* How can I create a bot like Maria?
📑 *A:* You can't deploy a version of *MARIA* thus it's not an open source project.
ᚖ ────── ✪ ────── ᚖ

📮 *Q10:* Is the project of *➳ᴹᴿ᭄𝐉𝐅𝐋𝐄𝐗* sponsored?
📑 *A:* Of course not, we're not sponsored either way but it could be your own pleasure to do that thus this is a non-profit organization.
\nᚖ ────── ✪ ────── ᚖ`;

        const footerText = '© Hitman47 Inc 2024';

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