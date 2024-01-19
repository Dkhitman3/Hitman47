import { BaseCommand, Command, Message } from '../../Structures'

@Command('bots', {
    description: 'List all Godspeed bots',
    category: 'general',
    aliases: ['bots'],
    usage: 'bots',
    cooldown: 5,
    exp: 100
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const buffer = await this.client.utils.getBuffer('https://telegra.ph/file/6fdff42626ceb5bf43f7f.mp4')
        let text = ''
        text += `➪ 😻𝔹𝐎𝕋𝐒😻\n\n`
        text += `➪ 🟦add your number\n\n`
        text += `➪ 🟦add your number\n\n`
        text += `➪ 🟦add your number\n\n`
        text += `➪ 🤖 *Bots 3*\n\n`
        text += `➪ ❚❚ ↻ godspeed ©️ 2024`
        return void (await M.reply(buffer, 'video', true, undefined, text))
    }
}
