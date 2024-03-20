import { BaseCommand, Command, Message } from '../../Structures'

@Command('x-video', {
    description: 'under 18 🔞',
    category: 'fun',
    aliases: ['x'],
    usage: 'xxx',
    cooldown: 5,
    exp: 100
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
             const image = await this.client.utils.getBuffer('https://telegra.ph/file/ce96c01f7361178209dd9.png')

        let text = ''
        text += `* hahaha😂😂😂* ✨\n\n`
        text += `*PORN GONNA KILL YOU BITCH😂😂😂* \n\n`
        text += `⚙️ *YOUR SO STUPID 😂😂😂💔*`
        return void (await M.reply(image, 'image', undefined, undefined, text))
    }
}

