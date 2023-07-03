import { BaseCommand, Command, Message } from '../../Structures'

@Command('bed', {
    description: 'Sends a picture of waifu in bed',
    category: 'nsfw',
    usage: 'bed',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const buffer = await this.client.utils.getBuffer('https://fantox-apis.vercel.app/bed')
        return void (await M.reply(buffer, 'image'))
    }
}
