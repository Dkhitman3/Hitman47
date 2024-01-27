import { BaseCommand, Command, Message } from '../../Structures';
import { proto } from '@whiskeysockets/baileys';

@Command('bots', {
    description: 'shows all H47 bots.',
    category: 'general',
    usage: 'bots',
    aliases: ['b'],
    exp: 20,
    cooldown: 3
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const botUsername = this.client.config.name;
        const botData = [{ sessionId: botUsername, number: this.client.correctJid(this.client.user?.id), active: true }];

        const formattedBotData = botData.reduce((acc, bot) => {
            const status = bot.active ? 'Active 🟩' : 'Inactive 🟥';
            acc += `\n\n🔰 *Name: ${bot.sessionId}*\n🧧 *Number: ${bot.number}*\n🔵 *Status: ${status}*`;
            return acc;
        }, '*🏮 Hitman47 Bots 🏮*');

        await M.reply(formattedBotData);
    }
                      }
