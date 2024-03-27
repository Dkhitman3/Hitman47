import { Command, BaseCommand, Message } from '../../Structures'

@Command('claim', {
    description: 'claims charactr',
    exp: 10,
    aliases: ['b', 'buy'],
    cooldown: 10,
    usage: 'claim',
    category: 'characters'
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const res = this.handler.charaResponse.get(M.from)
        if (!res) return void M.reply('no chara to claim atm')
        const { wallet, gallery } = await this.client.DB.getUser(M.sender.jid)
        if (res.price > wallet) return void M.reply('check ur wallet')
        this.handler.charaResponse.delete(M.from)
        await this.client.DB.updateUser(M.sender.jid, 'wallet', 'inc', -res.price)
        gallery.push(res.data)
        await this.client.DB.updateUser(M.sender.jid, 'gallery', 'set', gallery)
        return void M.reply(`You have bought ${res.data.name}`)
    }
}
