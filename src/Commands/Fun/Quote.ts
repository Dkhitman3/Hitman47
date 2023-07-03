import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('quote', {
    description: 'Will send you random quote.',
    aliases: ['qu'],
    category: 'fun',
    usage: `quote`,
    cooldown: 5,
    exp: 30,
    dm: false
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        // load JSON
        const quotes = JSON.parse((this.client.assets.get('quotes') as Buffer).toString()) as unknown as {
            quotes: {
                _id: string
                content: string
                author: string
            }[]
        }
        if (!quotes) return void null
        // select a random quote
        const quote = quotes.quotes[Math.floor(Math.random() * quotes.quotes.length)]
        const text = `📝 *Content:* ${quote.content}\n\n*✍️ Author:* ${quote.author}`
        M.reply(text)
    }
}
