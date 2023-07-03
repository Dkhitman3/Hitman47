import { BaseCommand, Command, Message } from '../../Structures'

@Command('nudes', {
    description: 'Sends a random nudes image',
    category: 'nsfw',
    usage: '',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async ({ reply }: Message): Promise<void> => {
        const { url } = await this.client.utils.fetch<{ url: string }>('https://fantox-apis.vercel.app/nude')
        return void (await reply(await this.client.utils.getBuffer(url), 'image'))
    }
}
