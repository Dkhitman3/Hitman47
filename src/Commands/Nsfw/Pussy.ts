import { BaseCommand, Command, Message } from '../../Structures'

@Command('pussy', {
    description: 'Get to know the owner of the bot',
    category: 'nsfw',
    aliases: ['pussy'],
    usage: 'pussy',
    cooldown: 5,
    exp: 100
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const image = await this.client.utils.getBuffer('https://telegra.ph/file/a8b0eb8e0f0215ef2b5ea.jpg')
        let text = ''
        text += `🍑here you go\n\n`
        return void (await M.reply(image, 'image', undefined, undefined, text))
    }
}
