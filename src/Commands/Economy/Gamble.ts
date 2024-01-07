import { Sticker } from 'wa-sticker-formatter'
import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('gamble', {
    description: 'economy for a bot',
    usage: 'gamble',
    category: 'economy',
    cooldown: 15,
    exp: 20
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { args }: IArgs): Promise<void> => {
        const directions = ['left', 'right'] as TGamblingDirections[]
        if (M.numbers.length < 1 || args.length < 1)
            return void M.reply(`Invalid usage! Example: *${this.client.config.prefix}gamble right 500*`)
        const amount = M.numbers[0]
        const { wallet } = await this.client.DB.getUser(M.sender.jid)
        const direction = args[1]
        const result = directions[Math.floor(Math.random() * directions.length)]
        await this.client.DB.setGold(M.sender.jid, result === direction ? amount : -amount)
        const sticker = await new Sticker(this.client.assets.get(result) as Buffer, {
            pack: 'Dk',
            author: `hitman47`,
            quality: 90,
            type: 'full'
        }).build()
        await M.reply(sticker, 'sticker')
        const text =
            result === direction ? `Congratulations 🎉 You won 🪙${amount} 📉` : `Hahahaha You lost 🪙${amount} 📈`
        return void (await M.reply(text))
    }
}

type TGamblingDirections = 'left' | 'right'
