import { BaseCommand, Command, Message } from '../../Structures'

@Command('fuck', {
    description: 'lets fuck',
    category: 'nsfw',
    aliases: ['fuck'],
    usage: 'fuck',
    cooldown: 5,
    exp: 100
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const buffer = await this.client.utils.getBuffer('https://telegra.ph/file/c09ef2c4cb45e50fb8bb7.mp4')
        let text = ''
        text += `🍑*you wanna fuck*\n\n`
        return void (await M.reply(buffer, 'video', true, undefined, text))
    }
}
