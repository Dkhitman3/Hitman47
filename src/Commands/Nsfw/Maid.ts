import { BaseCommand, Command, Message } from '../../Structures'

@Command('maid', {
    description: 'Sends a random nsfw image',
    category: 'nsfw',
    usage: '',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async ({ reply }: Message): Promise<void> => {
        const { url } = await this.client.utils.fetch<{ url: string }>('https://neko-maid-api.onrender.com')
        return void (await reply(await this.client.utils.getBuffer(url), 'image'))
    }
}
