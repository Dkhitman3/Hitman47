import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs, IPokemonAPIResponse } from '../../Types'

@Command('party', {
    description: "Displays user's pokemon party",
    usage: 'party',
    category: 'pokemon',
    cooldown: 5,
    exp: 25
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const { party } = await this.client.DB.getUser(M.sender.jid)
        if (party.length < 1) return void M.reply('no pokemon in your party')
        let text = `*Party*`
        party.forEach(
            (x, y) => (text += `\n\n*#${y + 1}*\n*Name:* ${this.client.utils.capitalize(x.name)}\n*Level:* ${x.level}`)
        )
        const buttons = [
            {
                buttonId: 'id1',
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
