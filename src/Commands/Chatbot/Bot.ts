import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import axios from 'axios'

@Command('bot', {
    description: 'chat with the bot .',
    aliases: ['bot'],
    category: 'dev',
    usage: `bot`,
    dm: true,
    cooldown: 5,
    exp: 30
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const chitoge = context.trim()
        if (!context) return void M.reply(`Fuck you`)
        await axios
            .get(`https://api.simsimi.net/v2/?text=${chitoge}&lc=en`)
            .then((response) => {
                // console.log(response);
                const text = `🎍 *Bot*:  ${response.data.success}`
                M.reply(text)
            })
            .catch((err) => {
                M.reply(`✖  An error occurred.`)
            })
    }
}
