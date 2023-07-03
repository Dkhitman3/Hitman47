import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import axios from 'axios'

@Command('fact', {
    description: 'Will send you random fact.',
    aliases: ['facts'],
    category: 'fun',
    usage: `fact`,
    cooldown: 5,
    exp: 30,
    dm: false
})
export default class extends BaseCommand {
    public override execute = async (M: Message, args: IArgs): Promise<void> => {
        await axios
            .get(`https://nekos.life/api/v2/fact`)
            .then((response) => {
                // console.log(response);
                const text = `📛 *Fact:* ${response.data.fact}`
                M.reply(text)
            })
            .catch((err) => {
                M.reply(`✖  An error occurred.`)
            })
    }
}
