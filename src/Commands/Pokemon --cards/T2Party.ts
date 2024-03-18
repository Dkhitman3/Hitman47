import { BaseCommand, Command, Message } from '../../Structures'

@Command('t2party', {
    category: 'pokemon',
    description: '',
    usage: 't2pc',
    cooldown: 15,
    exp: 35
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const { pc, party } = await this.client.DB.getUser(M.sender.jid)
        if (pc.length < 1) return void M.reply('no pokemon in your pc')
        if (M.numbers.length < 2) return void M.reply('index?')
        if (party.length >= 6) return void M.reply('full party')
        const i = M.numbers[1]
        if (i < 1 || i > pc.length) return void M.reply('Invalid index')
        const text = `*${this.client.utils.capitalize(pc[i - 1].name)}* transferred to your party`
        party.push(pc[i - 1])
        pc.splice(i - 1, 1)
        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { pc, party } })
        const buttons = [
            {
                buttonId: 'id',
                buttonText: { displayText: `${this.client.config.prefix}party` },
                type: 1
            },
            {
                buttonId: 'id2',
                buttonText: { displayText: `${this.client.config.prefix}pc` },
                type: 1
            }
        ]
        const buttonMessage = {
            text,
            footer: '',
            buttons: buttons,
            headerType: 1
        }
        return void (await this.client.sendMessage(M.from, buttonMessage, {
            quoted: M.message
        }))
    }
}
