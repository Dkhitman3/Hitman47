import { BaseCommand, Command, Message } from '../../Structures'

@Command('repo', {
    description: 'Get the base repo of the bot',
    category: 'general',
    aliases: ['script'],
    usage: 'repo',
    cooldown: 5,
    exp: 100
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const image = await this.client.utils.getBuffer('https://telegra.ph/file/7d99d1210ce607f428782.jpg')
        
        let text = ''
        text += `*Godspeed* ✨\n\n`
        text += `*fork and give a star 🌟 so you can get more updates* \n\n`
        text += `⚙️ *Repo Link: https://github.com/ChristianNimb/Godspeed*`
        return void (await M.reply(image, 'image', undefined, undefined, text))
    }
}

