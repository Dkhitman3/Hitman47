import { Command, BaseCommand, Message } from '../../Structures'

@Command('schara', {
    description: 'swaps chara',
    cooldown: 10,
    exp: 10,
    usage: 'schara',
    aliases: ['sc'],
    category: 'characters'
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const data = await this.client.DB.getUser(M.sender.jid)
        if (!data.gallery.length) return void M.reply('no claimed charas')
        if (M.numbers.length < 2) return void M.reply('Provide the indexes to swap')
        if (
            M.numbers[0] > data.gallery.length ||
            M.numbers[1] > data.gallery.length ||
            M.numbers[0] < 1 ||
            M.numbers[1] < 1
        )
            return void M.reply('check gallery')
        const t = data.gallery[M.numbers[0] - 1]
        data.gallery[M.numbers[0] - 1] = data.gallery[M.numbers[1] - 1]
        data.gallery[M.numbers[1] - 1] = t
        await this.client.DB.updateUser(M.sender.jid, 'gallery', 'set', data.gallery)
        return void M.reply(`swapped ${M.numbers[0]} and ${M.numbers[1]}`)
    }
}
