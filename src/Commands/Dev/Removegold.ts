import { BaseCommand, Message, Command } from '../../Structures'
import { IArgs } from '../../Types'

@Command('removegold', {
    description: 'reduces gold from all users wallet',
    aliases: ['reduceg', 'rg'],
    category: 'dev',
    dm: true,
    usage: 'reducegold <amount>',
    exp: 100
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void (await M.reply(`Please provide the amount of gold you want to reduce.`))
        const amount: any = context.split(' ')[0]
        await this.client.DB.user.find({}).exec(async (err, res) => {
            if (err) return void M.reply(`...`)
            for (let i = 0; i < res.length; i++) {
                await this.client.DB.removeGold(res[i].jid, amount)
            }
            return void M.reply(`🟥 Removed *${amount}* gold from *${res.length}* users wallet.`)
        })
    }
}
