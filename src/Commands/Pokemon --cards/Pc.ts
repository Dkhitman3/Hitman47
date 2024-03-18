import { Command, BaseCommand, Message } from '../../Structures'

@Command('pc', {
    description: '',
    exp: 10,
    category: 'pokemon',
    cooldown: 10,
    usage: 'pc'
})
export default class command extends BaseCommand {
    override execute = async ({ from, sender, message, reply }: Message): Promise<void> => {
        const { pc } = await this.client.DB.getUser(sender.jid)
        if (pc.length < 1) return void reply("You don't have any pokemon in your pc")
        let text = `*PC*\n`
        pc.forEach((x, y) => (text += `\n*#${y + 1} - ${this.client.utils.capitalize(x.name)}*`))
        const buttons = [
            {
                buttonId: 'id1',
                buttonText: { displayText: `${this.client.config.prefix}party` },
                type: 1
            }
        ]
        const buttonMessage = {
            text,
            footer: '',
            buttons: buttons,
            headerType: 1
        }
        return void (await this.client.sendMessage(from, buttonMessage, {
            quoted: message
        }))
    }
}
