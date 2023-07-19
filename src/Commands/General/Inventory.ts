import { BaseCommand, Command, Message } from '../../Structures'

@Command('inventory', {
    category: 'general',
    description: "Displays user's inventory",
    usage: 'inventory',
    aliases: ['inv'],
    cooldown: 10,
    exp: 30
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const { inventory, tag, quizWins } = await this.client.DB.getUser(M.sender.jid)
        const { items } = await this.client.DB.getFeature('store')
        let text = `🎒 *Inventory*\n\n🎴 *ID:*\n\t🏮 *Username: ${
            M.sender.username
        }*\n\t🧧 *Tag: #${tag}*\n\n♥️
        *>>* 🃏 *Quiz Wins:* ${quizWins}\n*>>* 🔗 *Total Items:* ${inventory.length}`
        if (inventory.length > 0) {
            text += `\n*>>* 📜 *Items:*\n`
            inventory.forEach((x, index) => {
                const i = items.findIndex((y) => y.name === x.item)
                const { emoji } = items[i]
                text += `\n*#${index + 1}*\n${emoji} *Item:* ${x.item
                    .split(' ')
                    .map((item) => this.client.utils.capitalize(item))
                    .join(' ')}\n🎗 *Usage Left:* ${x.usageLeft !== 0 ? x.usageLeft : 'Infinity'}\n`
            })
        }
        return void M.reply(text)
    }
}
