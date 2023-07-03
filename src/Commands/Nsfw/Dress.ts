import { BaseCommand, Command, Message } from '../../Structures'

@Command('dress', {
    description: 'Sends a random nsfw loli image',
    category: 'nsfw',
    usage: 'dress',
    exp: 20,
    cooldown: 6
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const buffer = await this.client.utils.getBuffer('https://fantox-apis.vercel.app/dress')
        return void (await M.reply(buffer, 'image'))
    }
}
