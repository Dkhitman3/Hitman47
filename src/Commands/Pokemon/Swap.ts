import { BaseCommand, Command, Message } from '../../Structures'

@Command('swap', {
    description: 'Swap',
    category: 'pokemon',
    usage: 'swap',
    exp: 10,
    cooldown: 15
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (M.numbers.length < 2) return void M.reply(`indexes?`)
        const data = await this.client.DB.getUser(M.sender.jid)
        if (
            M.numbers[0] > data.party.length ||
            M.numbers[1] > data.party.length ||
            M.numbers[0] < 1 ||
            M.numbers[1] < 1
        )
            return void M.reply('check parties')
        const t = data.party[M.numbers[0] - 1]
        data.party[M.numbers[0] - 1] = data.party[M.numbers[1] - 1]
        data.party[M.numbers[1] - 1] = t
        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { party: data.party } })
        return void M.reply(`Swapped ${M.numbers[0]} & ${M.numbers[1]}`)
    }
}
