import { BaseCommand, Command, Message } from '../../Structures'

@Command('cum', {
    description: 'Get to cum',
    category: 'nsfw',
    aliases: ['cum'],
    usage: 'cum',
    cooldown: 10,
    exp: 100
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const image = await this.client.utils.getBuffer('https://telegra.ph/file/39bfc95d9952623bf0fa4.jpg')
        let text = ''
        text += `🍑*here you go*\n\n`
        return void (await M.reply(image, 'image', undefined, undefined, text))
    }
}
